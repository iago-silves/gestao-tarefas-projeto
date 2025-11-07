const db = require("./db");

const Usuario = db.sequelize.define("usuario", {
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

Usuario.sync({ force: false })

module.exports = Usuario;
