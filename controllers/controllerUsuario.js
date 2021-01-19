"use strict";
const modelo = require("../models/DAOusuarios");
const pool = require("../pool");
const path = require("path");


let daoUsuario = new modelo(pool.obtenerPool());

////////FUNCIONES CALLBACK

function obtenerPerfil(request, response,next) {
    //console.log(request.session.currentUser);
    daoUsuario.getUsuario(response.locals.userId, (error, result) => {
        if (!error) {
            response.status(200)

            if (result.imagen) {
                let data = "data:image/png;base64," + result.imagen.toString('base64');
                result.imagen = data;
            }
            let fecha = result.fecha_nac.toString();
            result.fecha_nac = fecha.substring(0, 15);
            request.session.puntos = result.puntos;
            daoUsuario.getPublicaciones(response.locals.userId, (err, publicaciones) => {
                if (err) {
                    next(err)
                } else {
                    response.render("perfil", { publicaciones: publicaciones, user: result, propio: true, id: response.locals.userId, puntos: response.locals.puntos });
                }
            })
        } else {
            next(error)
        }
    })

}

function modificarForm(request, response,next) {
    daoUsuario.getUsuario(response.locals.userId, (error, result) => {
        if (error) {
            next(error)
        } else {
            response.status(200);
            if (result.imagen) {
                let data = "data:image/png;base64," + result.imagen.toString('base64');
                result.imagen = data;
            }
            response.render("modificarForm", { user: result });

        }
    })

}

function actualizarPerfil(request, response,next) {
    let usuario = {
        id: request.body.id,
        email: request.body.email,
        contrasena: request.body.password,
        nombre: request.body.name,
        sexo: request.body.sexo,
        fecha_nac: request.body.fecha_nacimiento
    }
    if (request.file) {
        usuario.imagen = request.file.buffer;
    }
    
    daoUsuario.actualizarUsuario(

        usuario,
        (error) => {
            if (error) {
                next(error)
            } else {
                response.status(200);
                response.redirect("/usuario/perfil");

            }
        })
}

function nuevoUsuario(request, response,next) {

    let usuario = {
        email: request.body.email,
        contrasena: request.body.password,
        nombre: request.body.name,
        sexo: request.body.sexo,
        fecha_nac: request.body.fecha_nacimiento
    }
    if (request.file) {
        usuario.imagen = request.file.buffer;
    }
    daoUsuario.crearUsuario(usuario, (error, id) => {
        if (error) {
            if(error.message == "Error de acceso a la base de datos"){
                response.render("registro", { errores: { email: "Ya existe un usuario con este email" } });
            }else{
                next(error)
            }
            
        } else {
            request.session.currentUser = id;
            request.session.puntos = 0;
            response.redirect("/usuario/Perfil");
        }
    })

}

function validar(request, response,next) {
    daoUsuario.isUserCorrect(request.body.email, request.body.password, (error, result) => {
        if (error) {
            console.log(error.message)
            if (error.message == "No existe el usuario con esa contraseña") {
                response.render("entrada", { errores: { password: "No existe el usuario con esa contraseña" } });
            } else {
                next(error)
            }

        } else {
            //console.log(id)
            request.session.currentUser = result.id;
            request.session.puntos = result.puntos;
            response.redirect("/usuario/Perfil");
        }
    })
}


function login(request, response) {
    response.redirect("/entrada");
}

function cerrarSesion(request, response) {
    request.session.destroy();
    response.redirect("/entrada")
}

function obtenerImagen(request, response,next) {
    daoUsuario.obtenerImagen(request.params.id, (error, result) => {
        if (error) {
            next(error)
        } else {
            response.status(200);
            if (result) {
                response.end(result)
            } else {
                response.sendfile(path.join(__dirname, "..", "public", "imagen", "interrogacion.png"));
            }
        }
    })
}

function publicar(request, response,next) {
    if (response.locals.puntos - 100 >= 0) {
        daoUsuario.publicar(response.locals.userId, request.file.buffer, request.body.descripcion, (error) => {
            if (error) {
                next(error)
            } else {
                request.session.puntos -= 100;
                response.redirect("/usuario/Perfil");
            }
        })
    } else {
        response.redirect("/usuario/Perfil");
    }

}


///////EXPORTAR TODAS LAS FUNCIONES EN UN OBJETO
module.exports = {
    obtenerPerfil: obtenerPerfil,
    modificarForm: modificarForm,
    actualizarPerfil: actualizarPerfil,
    nuevoUsuario: nuevoUsuario,
    validar: validar,
    login: login,
    cerrarSesion: cerrarSesion,
    obtenerImagen: obtenerImagen,
    publicar: publicar
}