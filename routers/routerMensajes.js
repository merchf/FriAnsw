"use strict";
const express = require("express");
const routerMensajes=express.Router()
const controlador= require("../controllers/controllerMensajes")
const middleUsuario = require("../middleware/middleUsuario");
//////routerUsuario.get("ruta",controlador.funcion())

routerMensajes.get("/mensajesRecibidos",middleUsuario.usuarioIdentificado,controlador.obtenerMensajes);
//routerMensajes.get("/enviarMensaje",middleUsuario.usuarioIdentificado,controlador.modificarForm);
routerMensajes.get("/borrarMensaje/:id",middleUsuario.usuarioIdentificado,controlador.borrarMensaje);





module.exports = routerMensajes;