"use strict";
const express = require("express");
const routerAmigo=express.Router();
const controlador= require("../controllers/controllerAmigo");
const middleUsuario = require("../middleware/middleUsuario");
const middlePeticion = require("../middleware/middlePeticion");

routerAmigo.use(middleUsuario.usuarioIdentificado);
routerAmigo.get("/buscador",controlador.mostrarBuscador);
routerAmigo.get("/perfil/:id",middleUsuario.esAmigo,controlador.mostrarAmigo)
routerAmigo.post("/buscar",controlador.buscarAmigo);
routerAmigo.get("/aceptar/:amigoId",controlador.aceptarPeticion);
routerAmigo.get("/rechazar/:amigoId",controlador.rechazarPeticion);
routerAmigo.get("/enviarSolicitud/:amigoId",middlePeticion.peticionYaEnviada,controlador.enviarPeticion)




module.exports = routerAmigo;