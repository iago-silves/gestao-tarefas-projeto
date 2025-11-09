const db = require("./db");

const Usuario = db.sequelize.define("Usuario", {
    nome: {
        type: db.Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: db.Sequelize.STRING,
        allowNull: false
    },
    senha: {
        type: db.Sequelize.STRING,
        allowNull: false
    }
}, {
    freezeTableName: true,
    tableName: "usuarios"
});

module.exports = Usuario;
