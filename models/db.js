require("dotenv").config();
const { Sequelize } = require("sequelize");

console.log("Dialect:", process.env.DB_DIALECT); // TESTE

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT
    }
);

sequelize.authenticate()
    .then(() => console.log("Conectado ao banco!"))
    .catch(err => console.error("Erro ao conectar:", err));

module.exports = { Sequelize, sequelize };
