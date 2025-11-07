const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const db = require("./models/db");
const Usuario = require("./models/Usuario");
require("./models/associations");

db.sequelize.sync({ force: false })
    .then(() => console.log("Banco sincronizado com sucesso!"))
    .catch(err => console.log("Erro ao sincronizar:", err));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.post("/usuario/cadastro",function(req,res){
    Usuario.create({
        nome: req.body.nome,
        email: req.body.email,
        senha: req.body.senha
    }).then(function(erro){
        res.send("Usuario cadastrado com sucesso")
    }).catch(function(erro){
        res.send("Erro ao cadastrar funcionario: " + erro)
    })
});

app.listen(8081, () => {
    console.log("Servidor ativo...");
});