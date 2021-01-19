"use strict";

class DAOpeticiones {
    constructor(pool) {
        this.pool = pool
    }

    mostrarPeticionesPendientes(id, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                let sql = "select nombre,imagen,idOrigen from peticion as p join usuario as u on(p.idOrigen=u.id) where idDestino=? and estado='pendiente'";
                connection.query(sql, [id], function (err, filas) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error al obtener laspeticiones pendientes"));
                    } else {
                        let result = filas.reduce((ac, a) => {
                            let fila = {
                                id: a.idOrigen,
                                nombre: a.nombre,
                                imagen: a.imagen
                            };
                            ac.push(fila);
                            return ac;
                        }, [])
                        callback(null, result);
                    }
                })
            }
        })
    }



    aceptarPeticion(idD, idO, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                let sql = "update peticion set estado='aceptada' where idOrigen=? and idDestino=?";
                connection.query(sql, [idD, idO], function (err) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error al aceptar la peticion"));
                    } else {
                        callback(null);
                    }
                })
            }
        })
    }

    rechazarPeticion(idD, idO, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                let sql = "update peticion set estado='rechazada' where idOrigen=? and idDestino=?";
                connection.query(sql, [idD, idO], function (err) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error la rechazar la peticion"));
                    } else {
                        callback(null);
                    }
                })
            }
        })
    }

    enviarPeticion(idPropia, idAmigo, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                let sql = "insert into peticion(idOrigen,idDestino) values(?,?)";
                connection.query(sql, [idPropia, idAmigo], function (err) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error al enviar la peticion"));
                    } else {
                        callback(null);
                    }
                })
            }
        })
    }

    peticionEnviada(idOrigen,idDestino,callback){
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                let sql = "select count(*) as enviada from peticion where (idOrigen=? and idDestino=?) or (idDestino=? and idOrigen=?)";
                connection.query(sql, [idOrigen, idDestino, idDestino, idOrigen], function (err,result) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error obtener la peticion"));
                    } else {
                        if(result[0].enviada == 0){
                            callback(null);
                        }else{
                            callback(new Error("Peticion ya enviada"));
                        }
                        
                    }
                })
            }
        })
    }

    mostrarPeticionesPropias(id, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                let sql = "select nombre,imagen,estado from peticion as p join usuario as u on(p.idDestino=u.id) where idOrigen=?";
                connection.query(sql, [id], function (err, filas) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error obteniendo peticiones propias"));
                    } else {
                        let result = filas.reduce((ac, a) => {
                            let fila = {
                                nombre: a.nombre,
                                imagen: a.imagen,
                                estado: a.estado
                            };
                            ac.push(fila);
                            return ac;
                        }, [])
                        callback(null, result);
                    }
                })
            }
        })
    }
}

module.exports = DAOpeticiones;

