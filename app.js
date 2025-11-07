require("dotenv").config();

const express = require("express");
const app = express();

const db = require("./models/db");
const Usuario = require("./models/Usuario");

db.sequelize.sync().then(() => {
    console.log("Banco sincronizado!");

    app.listen(8081, () => {
        console.log("Servidor ativo...");
    });
});
