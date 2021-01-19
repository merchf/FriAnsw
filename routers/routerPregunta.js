"use strict";
const express = require("express");
const routerPregunta=express.Router();
const controlador= require("../controllers/controllerPregunta");
const middleUsuario = require("../middleware/middleUsuario");

routerPregunta.use(middleUsuario.usuarioIdentificado);

routerPregunta.get("/lista",controlador.mostrarPreguntas);
routerPregunta.get("/opciones/:pregunta",controlador.esContestada)
routerPregunta.get("/responder/:pregunta",controlador.mostrarOpciones)
routerPregunta.post("/responder/:pregunta",controlador.responder)
routerPregunta.get("/crearPregunta",controlador.formNuevaPregunta)
routerPregunta.post("/crearPregunta",controlador.nuevaPregunta)
routerPregunta.post("/adivinar",controlador.mostrarAdivinar);
routerPregunta.post("/adivinar/:id",controlador.adivinar)



module.exports = routerPregunta;