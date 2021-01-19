"use strict";

class DAOmensajes {
    constructor(pool) {
        this.pool = pool
    }

    getMensajes(id,callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                let sql = "select * from mensaje where idReceptor=?";
                let values = [id];
                connection.query(sql,values, function (err, result) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error al obtener mensajes"));
                    } else {
                        callback(null, result);
                    }

                });
            }
        });
    }
    borrarMensaje(idMensaje, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                let sql = "DELETE FROM 'mensaje' WHERE id = ?";
                let values = [idMensaje];
                connection.query(sql, values, function (err) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error al intentar borrar el mensaje"));
                    } else {
                        callback(null);
                    }
                })
            }
        })
    }



}

module.exports = DAOmensajes;