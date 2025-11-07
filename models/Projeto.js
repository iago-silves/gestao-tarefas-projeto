const db = require("./db");

const Projeto = db.sequelize.define("Projeto", {
    nome: {
        type: db.Sequelize.STRING,
        allowNull: false
    },
    descricao: {
        type: db.Sequelize.TEXT,
        allowNull: true
    }
});

module.exports = Projeto;
