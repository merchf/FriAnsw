"use strict";
const modelo = require("../models/DAOmensajes");
const pool = require("../pool");
const path = require("path");


let daoMensajes = new modelo(pool.obtenerPool());

////////FUNCIONES CALLBACK

function obtenerMensajes(response,next) {
    //console.log(request.session.currentUser);
    daoMensajes.getMensajes(response.locals.userId, (error, result) => {
        if (error) {
            next(error)
        } else {
            response.status(200);
            //let fecha = DATE_FORMAT(result.fecha, '%e-%c-%Y');
            //let hora =   TIME(result.fecha);
           // result.fecha= fecha.substring(0, 15) +" "+ hora.substring(0, 15);
            response.render("mensajes", { mensajes: result, userId: response.locals.userId, puntos: response.locals.puntos })
        }
    })

}
function borrarMensaje(request, response,next) {
    daoMensajes.borrarMensaje(request.params.id, (error) => {
        if (error) {
            next(error)
        } else {
            response.redirect("/mensajes/mensajesRecibidos");
        }
    })
}


///////EXPORTAR TODAS LAS FUNCIONES EN UN OBJETO
module.exports = {
    obtenerMensajes: obtenerMensajes,
    borrarMensaje : borrarMensaje
}