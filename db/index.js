// SQliteとの接続設定を記述しているｊｓ

const { Sequelize } = require('sequelize');

// SQLiteとの接続設定
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite' // SQLiteファイルのパス
});

module.exports = sequelize;

