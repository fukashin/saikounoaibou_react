// pstgresSQLとの接続設定を記述しているｊｓ

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('Database1', 'fuk1', 'fuk1', {
  host: 'localhost',
  port: 5432,
  dialect: 'postgres'
});

module.exports = sequelize;
