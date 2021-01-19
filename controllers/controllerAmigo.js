"use strict";
const modelo = require("../models/DAOpeticiones");
const modeloUsuario = require("../models/DAOusuarios");
const pool = require("../pool");

let daoPeticion = new modelo(pool.obtenerPool());
let daoUsuario = new modeloUsuario(pool.obtenerPool());

function mostrarBuscador(request, response,next) {
    daoPeticion.mostrarPeticionesPendientes(response.locals.userId, function (error, peticiones) {
        if (error) {
            next(error)
        } else {
            daoUsuario.mostrarAmigos(response.locals.userId, function (err, friends) {
                if (err) {
                    next(err)
                } else {
                    response.status(200);
                    response.render("amigos", { solicitudes: peticiones, amigos: friends })
                }
            })

        }
    })

}

function mostrarAmigo(request, response,next) {
    daoUsuario.getUsuario(request.params.id, (error, result) => {
        if (error) {
            next(error)
        } else {
            response.status(200)

            if (result.imagen) {
                let data = "data:image/png;base64," + result.imagen.toString('base64');
                result.imagen = data;
            }
            let fecha = result.fecha_nac.toString();
            result.fecha_nac = fecha.substring(0, 15);
            daoUsuario.getPublicaciones(request.params.id, (err,publicaciones) => {
                if (err) {
                    next(err)
                } else {
                    response.status(200);
                    response.render("perfil", {publicaciones:publicaciones, user: result, propio: false, id: response.locals.userId, puntos: response.locals.puntos });
                }
            })

        }
    })
}

function buscarAmigo(request, response,next) {
    daoUsuario.buscarUsuario(request.body.buscar, response.locals.userId, (error, result) => {
        if (error) {
            next(error)
        } else {
            response.status(200);
            response.render("busqueda", { buscar: request.body.buscar, resultado: result, userId: response.locals.userId, puntos: response.locals.puntos })
        }
    })
}

function aceptarPeticion(request, response,next) {
    daoPeticion.aceptarPeticion(request.params.amigoId, response.locals.userId, (error) => {
        if (error) {
            next(error)
        } else {
            daoUsuario.anadirAmigo(response.locals.userId, request.params.amigoId, (err) => {
                if (err) {
                    next(err)
                } else {
                    response.redirect("/amigos/buscador");
                }
            })
        }
    })
}

function rechazarPeticion(request, response,next) {
    daoPeticion.rechazarPeticion(request.params.amigoId, response.locals.userId, (error) => {
        if (error) {
            next(error)
        } else {
            response.redirect("/amigos/buscador");
        }
    })
}

function enviarPeticion(request,response,next){
    daoPeticion.enviarPeticion(response.locals.userId,request.params.amigoId,(error)=>{
        if (error) {
            next(error)
        } else {
            response.redirect("/amigos/buscador");
        }
    })
}




module.exports = {
    mostrarBuscador: mostrarBuscador,
    mostrarAmigo: mostrarAmigo,
    buscarAmigo: buscarAmigo,
    aceptarPeticion: aceptarPeticion,
    rechazarPeticion: rechazarPeticion,
    enviarPeticion:enviarPeticion
}