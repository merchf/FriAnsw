"use strict";
const express = require("express");
const routerUsuario=express.Router()
const controlador= require("../controllers/controllerUsuario")
const multer = require("multer");
const multerFactory = multer({ storage: multer.memoryStorage() });
const middleUsuario = require("../middleware/middleUsuario");
//////routerUsuario.get("ruta",controlador.funcion())

routerUsuario.get("/perfil",middleUsuario.usuarioIdentificado,controlador.obtenerPerfil);
routerUsuario.get("/modificarForm",middleUsuario.usuarioIdentificado,controlador.modificarForm);
routerUsuario.post("/modificarPerfil",multerFactory.single("img_perfil"),middleUsuario.usuarioIdentificado,controlador.actualizarPerfil);
routerUsuario.get("/login",controlador.login)
routerUsuario.post("/login",multerFactory.none(),controlador.validar);
routerUsuario.get("/salir",controlador.cerrarSesion);
routerUsuario.post("/registrar",multerFactory.single("img_perfil"),controlador.nuevoUsuario);
routerUsuario.get("/imagen/:id",middleUsuario.usuarioIdentificado,controlador.obtenerImagen);
routerUsuario.post("/publicar",multerFactory.single("publicar"),middleUsuario.usuarioIdentificado,controlador.publicar)




module.exports = routerUsuario;