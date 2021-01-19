"use strict";
const modelo = require("../models/DAOpeticiones");
const pool = require("../pool");
let daoPeticion = new modelo(pool.obtenerPool());

function peticionYaEnviada(request,response,next){
    daoPeticion.peticionEnviada(response.locals.userId,request.params.amigoId,(error)=>{
        if(error){
            response.redirect("/amigos/buscador");
        }else{
            next();
        }
    })
}

module.exports = {
    peticionYaEnviada:peticionYaEnviada
}