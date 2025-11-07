const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const db = require("./models/db");
const Usuario = require("./models/Usuario");
require("./models/associations");

db.sequelize.sync({ force: false })
    .then(() => console.log("Banco sincronizado com sucesso!"))
    .catch(err => console.log("Erro ao sincronizar:", err));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/usuario/cadastro", function (req, res) {
    Usuario.create({
        nome: req.body.nome,
        email: req.body.email,
        senha: req.body.senha
    })
    .then(() => {
        res.send("Usuário cadastrado com sucesso!");
    })
    .catch((erro) => {
        res.send("Erro ao cadastrar usuário: " + erro);
    });
});

app.get("/usuario/listar", function (req, res) {
    Usuario.findAll()
        .then((usuarios) => {
            res.json(usuarios);
        })
        .catch((erro) => {
            res.send("Erro ao listar usuários: " + erro);
        });
});

app.get("/usuario/:id", function (req, res) {
    Usuario.findByPk(req.params.id)
        .then((usuario) => {
            if (usuario) {
                res.json(usuario);
            } else {
                res.send("Usuário não encontrado.");
            }
        })
        .catch((erro) => {
            res.send("Erro ao buscar usuário: " + erro);
        });
});

app.put("/usuario/atualizar/:id", function (req, res) {
    Usuario.update(
        {
            nome: req.body.nome,
            email: req.body.email,
            senha: req.body.senha
        },
        {
            where: { id: req.params.id }
        }
    )
    .then(([linhasAfetadas]) => {
        if (linhasAfetadas > 0) {
            res.send("Usuário atualizado com sucesso!");
        } else {
            res.send("Usuário não encontrado.");
        }
    })
    .catch((erro) => {
        res.send("Erro ao atualizar usuário: " + erro);
    });
});

app.delete("/usuario/deletar/:id", function (req, res) {
    Usuario.destroy({
        where: { id: req.params.id }
    })
    .then((linhasAfetadas) => {
        if (linhasAfetadas > 0) {
            res.send("Usuário deletado com sucesso!");
        } else {
            res.send("Usuário não encontrado.");
        }
    })
    .catch((erro) => {
        res.send("Erro ao deletar usuário: " + erro);
    });
});

app.listen(8081, () => {
    console.log("Servidor ativo...");
});
