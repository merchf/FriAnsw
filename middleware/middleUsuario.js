"use strict";
const modelo = require("../models/DAOusuarios");
const pool = require("../pool");
let daoUsuario = new modelo(pool.obtenerPool());

function usuarioIdentificado(request,response,next){
    if(request.session.currentUser){
        response.locals.userId = request.session.currentUser;
        response.locals.puntos = request.session.puntos;
        next()
    }else{
        response.redirect("/usuario/login");
    }
}

function esAmigo(request,response,next){
    daoUsuario.esAmigo(response.locals.userId,request.params.id,(error)=>{
        if(error){
            response.redirect("/amigos/buscador");
        }else{
            next();
        }
    })
}

module.exports ={
    usuarioIdentificado:usuarioIdentificado,
    esAmigo,esAmigo
}