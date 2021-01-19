"use strict";
const modelo = require("../models/DAOpreguntas");
const pool = require("../pool");

let daoPregunta = new modelo(pool.obtenerPool());

function mostrarPreguntas(request, response,next) {
    daoPregunta.mostrarPreguntasAleatorias((error, result) => {
        if (error) {
            next(error)
        } else {
            response.status(200);
            response.render("preguntas", { preguntas: result, userId: response.locals.userId, puntos: response.locals.puntos })
        }
    })
}

function esContestada(request, response,next) {
    daoPregunta.esContestada(request.params.pregunta, response.locals.userId, (error, result) => {
        if (error) {
            next(error)
        } else {
            daoPregunta.respuestasDeAmigos(response.locals.userId, request.params.pregunta, (err, resultado) => {
                if (err) {
                    next(err)
                } else {
                    //console.table(resultado);
                    response.status(200);
                    response.render("contestar", { question: request.params.pregunta, pregunta: result, userId: response.locals.userId, puntos: response.locals.puntos, amigos: resultado })
                }
            })

        }
    })
}

function mostrarOpciones(request, response,next) {
    daoPregunta.mostrarPregunta(request.params.pregunta, (error, result) => {
        if (error) {
            next(error)
        } else {
            response.status(200);
            response.render("opciones", { userId: response.locals.userId, puntos: response.locals.puntos, opciones: result })
        }
    })
}

function responder(request, response,next) {
    //console.table(request.body.respuesta);
    if (request.body.respuesta[0] == 'otra') {
        daoPregunta.nuevaOpcion(request.params.pregunta, request.body.respuesta[1], (error, result) => {
            if (error) {
                next(error)
            } else {
                response.redirect("/pregunta/responder/" + request.params.pregunta);
            }
        })
    } else {
        daoPregunta.responder(request.params.pregunta, request.body.respuesta[0], response.locals.userId, (err) => {
            if (err) {
                next(err)
            } else {
                response.redirect("/pregunta/opciones/" + request.params.pregunta);
            }
        });
    }
}

function nuevaPregunta(request, response,next) {
    daoPregunta.crearNuevaPregunta(response.locals.userId, request.body.pregunta, (error, result) => {
        if (error) {
            next(error)
        } else {
            response.redirect("/pregunta/responder/" + result);
        }
    });
}

function formNuevaPregunta(request, response) {
    response.status(200);
    response.render("nuevaPregunta", { userId: response.locals.userId, puntos: response.locals.puntos })
}

function mostrarAdivinar(request, response,next) {
    daoPregunta.amigoHaRespondido(request.body.quien, request.body.question, (error, result) => {
        if (error) {
            next(error)
        } else {
            //console.table(result)
            if (result) {
                daoPregunta.opcionesConCorrecta(request.body.question, result.respuesta, (err, resultado) => {
                    if (err) {
                        next(err)
                    } else {
                        response.status(200);
                        response.render("adivinar", { contestado: result,amigo:request.body.quien, pregunta: result.pregunta, quien: result.nombre, userId: response.locals.userId, puntos: response.locals.puntos, preguntaId: request.body.question, opciones: resultado });
                    }
                })
            } else {
                response.status(200);
                response.render("adivinar", { contestado: result, userId: response.locals.userId, puntos: response.locals.puntos});
            }

        }
    })
}

function adivinar(request,response,next){
    daoPregunta.amigoHaRespondido(request.body.amigo, request.params.id, (error, result) => {
        if (error) {
            next(error)
        } else {
            let adivinado = result.respuesta==request.body.respuesta;
            daoPregunta.adivinar(request.params.id,response.locals.userId,request.body.amigo,adivinado,(err)=>{
                if (err) {
                    next(err)
                } else {
                    if(adivinado){
                        request.session.puntos+=50;
                    }
                    response.redirect("/pregunta/opciones/"+request.params.id);
                }
            })
        }
    })
}



module.exports = {
    mostrarPreguntas: mostrarPreguntas,
    esContestada: esContestada,
    mostrarOpciones: mostrarOpciones,
    responder: responder,
    nuevaPregunta: nuevaPregunta,
    formNuevaPregunta: formNuevaPregunta,
    mostrarAdivinar: mostrarAdivinar,
    adivinar:adivinar
}