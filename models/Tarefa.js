const db = require("./db");

const Tarefa = db.sequelize.define("Tarefa", {
    titulo: {
        type: db.Sequelize.STRING,
        allowNull: false
    },
    descricao: {
        type: db.Sequelize.TEXT,
        allowNull: true
    },
    status: {
        type: db.Sequelize.ENUM("pendente", "em_progresso", "concluida"),
        defaultValue: "pendente"
    }
});

module.exports = Tarefa;
