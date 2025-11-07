const express = require("express");
const app = express();
const db = require("./models/db");
require("./models/associations");

db.sequelize.sync({ force: false })
    .then(() => console.log("Banco sincronizado com sucesso!"))
    .catch(err => console.log("Erro ao sincronizar:", err));

app.listen(8081, () => {
    console.log("Servidor ativo...");
});