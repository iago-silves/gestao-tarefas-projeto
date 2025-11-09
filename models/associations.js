const Usuario = require("./Usuario");
const Projeto = require("./Projeto");
const Tarefa = require("./Tarefa");

Usuario.hasMany(Projeto, {
    foreignKey: "usuarioId",
    onDelete: "CASCADE"
});

Projeto.belongsTo(Usuario, {
    foreignKey: "usuarioId"
});

Projeto.hasMany(Tarefa, {
    foreignKey: "projetoId",
    onDelete: "CASCADE"
});

Tarefa.belongsTo(Projeto, {
    foreignKey: "projetoId"
});

Usuario.hasMany(Tarefa, {
    foreignKey: "responsavelId",
    onDelete: "SET NULL"
});

Tarefa.belongsTo(Usuario, {
    foreignKey: "responsavelId",
    as: "responsavel"
});

module.exports = { Usuario, Projeto, Tarefa };
