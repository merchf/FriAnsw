"use strict";
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const routerUser = require("./routers/routerUsuario");
const routerFriend = require("./routers/routerAmigo");
const routerQuestion = require("./routers/routerPregunta");
const routerMensajes = require("./routers/routerMensajes");
const config = require("./config");
const middlewareError = require("./middleware/middleError")
const expressValidator = require("express-validator");
const session = require("express-session");
const mysqlSession = require("express-mysql-session");
const MySQLStore = mysqlSession(session);
const sessionStore = new MySQLStore({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
});
const middlewareSession = session({
    saveUninitialized: false,
    secret: "foobar34",
    resave: false,
    store: sessionStore
});




app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const directorioFicherosEstaticos = path.join(__dirname, "public");
app.use(express.static(directorioFicherosEstaticos));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(middlewareSession);


app.get("/", function (request, response) {
    response.redirect("/entrada");
});

app.get("/entrada", function (request, response) {
    response.render("entrada", { errores: null })
})

app.get("/registro", function (request, response) {
    response.render("registro", { errores: null })
})

app.use("/usuario", routerUser);
app.use("/amigos", routerFriend);
app.use("/pregunta", routerQuestion);
app.use("/mensajes", routerMensajes);


app.use(middlewareError.serverError);
app.use(middlewareError.NotFoundError);





app.listen(config.port, function (err) {
    if (err) {
        console.error("No se pudo inicializar el servidor: "
            + err.message);
    } else {
        console.log("Servidor arrancado en el puerto 3000");
    }
});