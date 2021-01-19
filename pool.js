"use strict";
const mysql = require("mysql");
const config = require("./config");

const pool = mysql.createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
});

function obtenerPool(){
    return pool;
}

function terminarPool(){
    pool.end();
}

module.exports = {obtenerPool:obtenerPool,
                    terminarPool:terminarPool}