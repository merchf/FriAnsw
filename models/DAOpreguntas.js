"use strict";

class DAOpreguntas {
    constructor(pool) {
        this.pool = pool
    }

    mostrarPreguntasAleatorias(callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                let sql = "select * from pregunta order by rand() limit 5";
                connection.query(sql, function (err, result) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error al obtener preguntas"));
                    } else {
                        callback(null, result);
                    }

                });
            }
        });
    }
    mostrarPregunta(id, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                let sql = "select pregunta,o.textoOpcion,o.idOpcion as respuestaId from pregunta as p left join opcion as o on p.id = o.idPregunta where p.id=?";
                connection.query(sql, [id], function (err, result) {
                    connection.release();
                    if (err) {
                        callback(new Error("No ha sido posible obtener la pregunta"));
                    } else {
                        if (result.length == 0) {
                            callback(new Error("La pregunta que buscas no existe"));
                        } else {
                            let options = [];
                            if (result[0].textoOpcion) {
                                result.forEach(element => {
                                    options.push({
                                        id: element.respuestaId,
                                        text: element.textoOpcion
                                    });
                                });
                            }

                            let question = {
                                id: id,
                                text: result[0].pregunta,
                                options: options
                            };
                            //console.table(question)
                            callback(null, question);
                        }

                    }

                });
            }
        });
    }
    crearNuevaPregunta(idCreador, textoPregunta, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                let sql = "insert into pregunta(creador,pregunta) values(?,?)";
                let values = [idCreador, textoPregunta];
                connection.query(sql, values, function (err, result) {
                    connection.release();
                    if (err) {
                        callback(new Error("No ha sido posible crear la pregunta"));
                    } else {
                        //tengo que crear una respuesta

                        callback(null, result.insertId)
                    }
                });
            }
        });
    }

    esContestada(pregunta, usuario, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                let sql = "SELECT preguntaId,pregunta,textoOpcion FROM respuesta as r join pregunta as p on (p.id=r.preguntaId) join opcion as o on (r.respuesta=o.idOpcion and r.preguntaId=o.idPregunta) where preguntaId=? and quienResponde=?";
                let values = [pregunta, usuario];
                connection.query(sql, values, function (err, result) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"));
                    } else {
                        //tengo que crear una respuesta
                        if (result.length == 0) {
                            result.contestada = false;
                        } else {
                            result = result[0];
                            result.contestada = true;
                        }

                        callback(null, result)
                    }
                });
            }
        });
    }

    responder(idPregunta, idOpcion, usuario, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                let sql = "insert into respuesta(preguntaId,respuesta,quienResponde) values (?,?,?)";
                let values = [idPregunta, idOpcion, usuario];
                connection.query(sql, values, function (err, result) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error al responder la pregunta"));
                    } else {


                        callback(null)
                    }
                });
            }
        });
    }

    nuevaOpcion(idPregunta, textoOpcion, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                let sql = "insert into opcion(idPregunta,idOpcion,textoOpcion) SELECT ?,ifnull( max(idOpcion)+1,0),? FROM opcion where idPregunta=?";
                let values = [idPregunta, textoOpcion, idPregunta];
                connection.query(sql, values, function (err, result) {
                    connection.release();
                    if (err) {
                        callback(new Error("No se ha podido añadir la opcion"));
                    } else {
                        callback(null)
                    }
                });
            }
        });
    }

    respuestasDeAmigos(idUsuario, idPregunta, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                let sql = "SELECT usuarioBid,adivinado,nombre FROM amigo as a left join respuestaamigos as ra on (a.usuarioBId=ra.idUsuarioAdivinar and ra.idPregunta=?) join usuario as u on(a.usuarioBid=u.id) where a.usuarioAId=?";
                let values = [idPregunta, idUsuario];
                connection.query(sql, values, function (err, result) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"));
                    } else {
                        callback(null, result)
                    }
                });
            }
        });
    }

    amigoHaRespondido(amigo, pregunta, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                let sql = "SELECT pregunta,nombre,respuesta FROM respuesta as r join pregunta as p on(r.preguntaId=p.id) join usuario as u on(r.quienResponde=u.id) where preguntaId=? and quienresponde=?";
                let values = [pregunta, amigo];
                connection.query(sql, values, function (err, result) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"));
                    } else {
                        //console.log(pregunta+"  quienResponde: "+amigo)
                        //console.table(result[0].respuesta)
                        callback(null, result[0])
                    }
                });
            }
        });
    }

    opcionesConCorrecta(pregunta, correcta, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                let sql = "(SELECT idOpcion,textoOpcion FROM opcion where idPregunta=? and idOpcion=?) UNION (select idOpcion,textoOpcion from opcion WHERE idPregunta=? AND idOpcion<>? limit 4) order by rand()";
                let values = [pregunta, correcta, pregunta, correcta];
                connection.query(sql, values, function (err, result) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error obtener las opciones"));
                    } else {
                        callback(null, result)
                    }
                });
            }
        });
    }

    adivinar(pregunta, idAdivinador, idUsuarioAdivinar, adivinado, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                let sql = "insert into respuestaAmigos(idPregunta,idAdivinador,idUsuarioAdivinar,adivinado) values(?,?,?,?)";
                let values = [pregunta, idAdivinador, idUsuarioAdivinar, adivinado];
                connection.query(sql, values, function (err) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error al intentar adivinar la pregunta"));
                    } else {
                        callback(null)
                    }
                });
            }
        });
    }
}

module.exports = DAOpreguntas;