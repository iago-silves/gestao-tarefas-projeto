const db = require("./db");

const Projeto = db.sequelize.define("Projeto", {
    nome: {
        type: db.Sequelize.STRING,
        allowNull: false
    },
    descricao: {
        type: db.Sequelize.TEXT,
        allowNull: true
    },
    progresso: {
        type: db.Sequelize.FLOAT,
        defaultValue: 0
    }
});

module.exports = Projeto;
