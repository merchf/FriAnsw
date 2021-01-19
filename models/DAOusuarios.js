"use strict";

class DAOusuarios {
    constructor(pool) {
        this.pool = pool
    }

    obtenerImagen(id,callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                let sql = "select imagen from usuario where id=?";
                let values = [id];
                //console.table(values);
                connection.query(sql, values, function (err, result) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"));
                    } else {
                        if (result.length == 0) {//la consulta no ha devuelto resultados
                            callback(new Error("El usuario no tiene imagen"), false);
                        } else {
                            callback(null, result[0].imagen);
                        }
                    }
                })
            }
        })
    }

    emailExists(email,callback){
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                let sql = "select count(*)  from usuario where email=?";
                let values = [email];
                //console.table(values);
                connection.query(sql, values, function (err, result) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"));
                    } else {
                        if (result.length == 0) {//la consulta no ha devuelto resultados
                            callback(new Error("No existe el usuario"));
                        } else {
                            callback(null);
                        }
                    }
                })
            }
        })
    }

    //comprueba si el usuario ha sido registrado previamente
    isUserCorrect(email, password, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                let sql = "select id,puntos  from usuario where email=? and contrasena=?";
                let values = [email, password];
                //console.table(values);
                connection.query(sql, values, function (err, result) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"));
                    } else {
                        if (result.length == 0) {//la consulta no ha devuelto resultados
                            callback(new Error("No existe el usuario con esa contraseña"), false);
                        } else {
                            callback(null, result[0]);
                        }
                    }
                })
            }
        })
    }

    getUsuario(id, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                let sql = "select * from usuario where id=?";
                let values = [id];
                connection.query(sql, values, function (err, result) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"));
                    } else {
                        if (result.length == 0) {//la consulta no ha devuelto resultados
                            callback(new Error("No existe el usuario"));
                        } else {
                            callback(null, result[0]);
                        }
                    }
                })
            }
        })
    }

    crearUsuario(usuario, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                let sql = "insert into usuario(email,contrasena,nombre,sexo,fecha_nac,imagen) values(?,?,?,?,?,?)";
                let values = [usuario.email, usuario.contrasena, usuario.nombre, usuario.sexo, usuario.fecha_nac, usuario.imagen];
                connection.query(sql, values, function (err, result) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"));
                    } else {
                        callback(null, result.insertId)
                    }
                })
            }
        })
    }

    actualizarUsuario(usuario, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                let sql = "update usuario set email=?,nombre=?,sexo=?";
                let values = [usuario.email, usuario.nombre, usuario.sexo];
                if (usuario.contrasena != "") {
                    sql += ",contrasena=?";
                    values.push(usuario.contrasena);
                }
                if (typeof (usuario.imagen) != "undefined") {
                    sql += ",imagen=?";

                    values.push(usuario.imagen);
                }
                if (usuario.fecha_nac != "") {
                    sql += ",fecha_nac=?";
                    values.push(usuario.fecha_nac);
                }
                sql += " where id=?";
                values.push(usuario.id);
                //console.table(values)
                //console.log(sql)
                connection.query(sql, values, function (err) {
                    connection.release();
                    if (err) {
                        err.message = "Ya existe un usuario con el email: "+usuario.email;
                        callback(err)
                        //callback(new Error("Error de acceso a la base de datos al actualizar"));
                    } else {
                        callback(null)
                    }
                })
            }
        })
    }

    /*actualizarPuntos(id, puntos, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                let sql = "update usuario set puntos=? where id=?";
                let values = [puntos, id];
                connection.query(sql, values, function (err, result) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"));
                    } else {
                        callback(null)
                    }
                })
            }
        })
    }*/

    buscarUsuario(cadena,id, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                let sql = "select * from usuario as u where nombre like ? and id<>? and id not in (select usuarioAid from amigo where usuarioBid=?)";
                connection.query(sql, ["%" + cadena + "%",id,id], function (err, filas) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"));
                    } else {
                        let result = filas.reduce((ac, a) => {
                            let fila = {
                                id: a.id,
                                nombre: a.nombre,
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



    anadirAmigo(miId, amigoId, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                let sql = "insert into amigo(usuarioAid,usuarioBid) values(?,?),(?,?)";
                let values = [miId, amigoId, amigoId, miId];
                connection.query(sql, values, function (err, result) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"));
                    } else {
                        callback(null)
                    }
                })
            }
        })
    }

    mostrarAmigos(id,callback){
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                let sql = "select usuarioBid,nombre from amigo as a INNER join usuario as u on (a.usuarioBid=u.id) where usuarioAid=?";
                let values = [id];
                connection.query(sql, values, function (err, result) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"));
                    } else {
                        callback(null,result)
                    }
                })
            }
        })
    }

    esAmigo(idA,idB,callback){
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                let sql = "select count(*) as esAmigo from amigo where usuarioAid=? and usuarioBid=?";
                let values = [idA,idB];
                connection.query(sql, values, function (err,result) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"));
                    } else {
                        if(result[0].esAmigo == 0){
                            callback(new Error("No sois amigos"));
                        }else{
                            callback(null)
                        }
                        
                    }
                })
            }
        })
    }

    getPublicaciones(id, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                let sql = "select imagen,descripcion from publicaciones where usuario=? ";
                connection.query(sql, [id], function (err, filas) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"));
                    } else {
                        let result = filas.reduce((ac, a) => {
                            let fila = {
                                foto:"data:image/png;base64," + a.imagen.toString('base64'),
                                descripcion: a.descripcion
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

    publicar(usuario,imagen,descripcion,callback){
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                let sql = "insert into publicaciones(usuario,imagen,descripcion) values (?,?,?)";
                let values = [usuario,imagen,descripcion];
                connection.query(sql, values, function (err) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"));
                    } else {
                        callback(null)
                    }
                })
            }
        })
    }

}

module.exports = DAOusuarios;