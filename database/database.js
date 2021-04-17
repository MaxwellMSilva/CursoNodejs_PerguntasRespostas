const sequelize = require('sequelize');

const connection = new sequelize('guiaperguntas', 'root', 'DatabaseSQL', {
    host: 'localhost',
    dialect: 'mysql',
});

module.exports = connection;
