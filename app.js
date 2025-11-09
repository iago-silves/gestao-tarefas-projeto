const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const db = require("./models/db");
const Usuario = require("./models/Usuario");
const Projeto = require("./models/Projeto");
const Tarefa = require("./models/Tarefa");

const recalcularProgresso = require("./utils/Progresso");

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

app.post("/usuario/login", async function(req, res){
    const { email, senha } = req.body;

    try {
        const usuario = await Usuario.findOne({ where: { email: email } });

        if (!usuario) {
            return res.status(404).send("Usuário não encontrado");
        }

        if (usuario.senha !== senha) {
            return res.status(401).send("Senha incorreta");
        }

        res.send("Login realizado com sucesso!");
    } catch (err) {
        res.status(500).send("Erro ao realizar login: " + err);
    }
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

app.post("/projeto/cadastrar", async (req, res) => {
    try {
        const { nome, descricao, usuarioId } = req.body;

        // valida se usuario existe
        const usuario = await Usuario.findByPk(usuarioId);
        if (!usuario) {
            return res.status(404).send("Usuário não encontrado.");
        }

        const projeto = await Projeto.create({
            nome,
            descricao,
            usuarioId
        });

        res.status(201).json({
            mensagem: "Projeto criado com sucesso!",
            projeto
        });
    } catch (err) {
        res.status(500).send("Erro ao criar projeto: " + err);
    }
});

app.get("/projeto/listar", async (req, res) => {
    try {
        const projetos = await Projeto.findAll({
            include: [{ model: Usuario }]
        });

        res.json(projetos);
    } catch (err) {
        res.status(500).send("Erro ao listar projetos: " + err);
    }
});

app.get("/projeto/:id", async (req, res) => {
    try {
        const projeto = await Projeto.findByPk(req.params.id, {
            include: [{ model: Usuario }]
        });

        if (!projeto) {
            return res.status(404).send("Projeto não encontrado.");
        }

        res.json(projeto);
    } catch (err) {
        res.status(500).send("Erro ao buscar projeto: " + err);
    }
});

app.put("/projeto/atualizar/:id", async (req, res) => {
    try {
        const { nome, descricao, usuarioId } = req.body;

        // valida se usuario existe (se enviado)
        if (usuarioId) {
            const usuario = await Usuario.findByPk(usuarioId);
            if (!usuario) {
                return res.status(404).send("Usuário informado não existe.");
            }
        }

        const [linhasAfetadas] = await Projeto.update(
            { nome, descricao, usuarioId },
            { where: { id: req.params.id } }
        );

        if (linhasAfetadas === 0) {
            return res.status(404).send("Projeto não encontrado.");
        }

        res.send("Projeto atualizado com sucesso!");
    } catch (err) {
        res.status(500).send("Erro ao atualizar projeto: " + err);
    }
});

app.delete("/projeto/deletar/:id", async (req, res) => {
    try {
        const linhasAfetadas = await Projeto.destroy({
            where: { id: req.params.id }
        });

        if (linhasAfetadas === 0) {
            return res.status(404).send("Projeto não encontrado.");
        }

        res.send("Projeto deletado com sucesso!");
    } catch (err) {
        res.status(500).send("Erro ao deletar projeto: " + err);
    }
});

app.post("/tarefa/cadastrar", async (req, res) => {
    try {
        const { titulo, descricao, projetoId, prioridade, percentual } = req.body;

        const tarefa = await Tarefa.create({
            titulo,
            descricao,
            projetoId,
            prioridade,
            percentual,
            status: "pendente"
        });

        await recalcularProgresso(projetoId);

        res.json(tarefa);
    } catch (erro) {
        res.status(500).send("Erro ao cadastrar tarefa: " + erro);
    }
});

app.get("/tarefa/listar", async (req, res) => {
    try {
        const tarefas = await Tarefa.findAll();
        res.json(tarefas);
    } catch (erro) {
        res.status(500).send("Erro ao listar tarefas: " + erro);
    }
});

app.get("/tarefa/projeto/:projetoId", async (req, res) => {
    try {
        const tarefas = await Tarefa.findAll({
            where: { projetoId: req.params.projetoId }
        });
        res.json(tarefas);
    } catch (erro) {
        res.status(500).send("Erro ao buscar tarefas: " + erro);
    }
});

app.put("/tarefa/atualizar/:id", async (req, res) => {
    try {
        const { titulo, descricao, prioridade, percentual } = req.body;

        const tarefa = await Tarefa.findByPk(req.params.id);

        if (!tarefa) {
            return res.status(404).send("Tarefa não encontrada");
        }

        let novoStatus = tarefa.status;

        if (percentual === 100) novoStatus = "concluida";
        else if (percentual > 0) novoStatus = "em_progresso";
        else novoStatus = "pendente";

        await tarefa.update({
            titulo,
            descricao,
            prioridade,
            percentual,
            status: novoStatus
        });

        await recalcularProgresso(tarefa.projetoId);

        res.json(tarefa);
    } catch (erro) {
        res.status(500).send("Erro ao atualizar tarefa: " + erro);
    }
});

app.delete("/tarefa/deletar/:id", async (req, res) => {
    try {
        const tarefa = await Tarefa.findByPk(req.params.id);

        if (!tarefa) {
            return res.status(404).send("Tarefa não encontrada");
        }

        const projetoId = tarefa.projetoId;

        await tarefa.destroy();

        await recalcularProgresso(projetoId);

        res.send("Tarefa deletada com sucesso!");
    } catch (erro) {
        res.status(500).send("Erro ao deletar tarefa: " + erro);
    }
});

app.get("/tarefa/filtrar", async (req, res) => {
    try {
        const { status, responsavelId } = req.query;

        const filtros = {};

        if (status) filtros.status = status;
        if (responsavelId) filtros.responsavelId = Number(responsavelId);

        const tarefas = await Tarefa.findAll({
            where: filtros
        });

        res.json(tarefas);
    } catch (erro) {
        res.status(500).send("Erro ao filtrar tarefas: " + erro);
    }
});


app.listen(8081, () => {
    console.log("Servidor ativo...");
});
