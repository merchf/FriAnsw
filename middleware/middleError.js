"use strict";
const util = require("../public/utils")

/////////////////////////////////////DATOS PARA 404//////////////////////////////////////////
const frase = ["¿Sabías que no se puede sonreir con los ojos cerrados?... Es mentira solo queriamos hacerte sonreir",
    "¿Sabías que no pudes respirar rápido y fuerte con la boca abierta y la lengua fuera?..... Buen chico, ahora siéntate y dame la patita",
    "¿Sabías que puedes saltar de un avión sin paracaídas? Pero solo una vez...",
    "¿Sabías que un buceador se tira hacia atrás ya que si se tira hacia delante se cae en la lancha?",
    "¿Sabías que una persona a lo largo de toda su vida se traga mientras duerme al menos 500 bichos? Seguro que hoy duermes intentando respirar por la nariz",
    "¿Sabías que no puedes tragar y respirar a la vez? Inténtalo ya verás",
    "¿Sabías que la cabeza del oso Yogui va separada del cuerpo para facilitar las animaciones?",
    "¿Sabías que la pantalla de tu teléfono tiene más bacterias que la tapa de un váter?",
    "¿Sabías que el 50% de la población es la mitad?",
    "¿Sabías que no puedes mirar hacia arriba sin abrir la boca? Has mirado eh, si se puede si"
];
/////////////////////////////////////DATOS PARA 404//////////////////////////////////////////

function NotFoundError(request, response) {
    response.status(404);
    // envío de página 404
    response.render("error404", {
        frase: frase[util(frase)]
    });
}

function serverError(error, request, response, next) {
    // Código 500: Internal server error
    response.status(500);
    response.render("error500", {
        mensaje: error.message,
        //pila: error.stack
    });
}

module.exports ={
    NotFoundError:NotFoundError,
    serverError:serverError
}