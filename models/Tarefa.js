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
    },
    responsavelId: {
        type: db.Sequelize.INTEGER,
        allowNull: true
    },
    dataConclusao: {
        type: db.Sequelize.DATE,
        allowNull: true
    },
    prioridade: {
        type: db.Sequelize.ENUM("baixa", "media", "alta"),
        defaultValue: "media"
    },
    percentual: {
        type: db.Sequelize.INTEGER,
        defaultValue: 0
    },
    projetoId: {
        type: db.Sequelize.INTEGER,
        allowNull: false
    }
});

module.exports = Tarefa;

