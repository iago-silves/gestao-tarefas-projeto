const Usuario = require("./Usuario");
const Projeto = require("./Projeto");
const Tarefa = require("./Tarefa");

Usuario.hasMany(Projeto, {
    foreignKey: "usuarioId",
    onDelete: "CASCADE",
});
Projeto.belongsTo(Usuario, {
    foreignKey: "usuarioId",
});

Projeto.hasMany(Tarefa, {
    foreignKey: "projetoId",
    onDelete: "CASCADE",
});
Tarefa.belongsTo(Projeto, {
    foreignKey: "projetoId",
});

module.exports = { Usuario, Projeto, Tarefa };
