// アクティブウィンドウ監視サービスをインポート
const startActiveWindowMonitoring = require('../services/activeWindowService');
// データベース接続の設定をインポート
const sequelize = require('../db');

// アプリケーションの初期化を行う非同期関数
async function initializeApp() {
  try {
    // データベース接続の初期化メッセージ
    console.log('Initializing database connection...');
    // データベースに接続
    await sequelize.authenticate();
    // 接続成功のメッセージ
    console.log('Connection has been established successfully.');
    // データベースの同期を実行
    await sequelize.sync();
    // 同期成功のメッセージ
    console.log('Database synchronized successfully.');
    // アクティブウィンドウの監視を開始
    startActiveWindowMonitoring();
  } catch (error) {
    // データベース接続に失敗した場合のエラーメッセージ
    console.error('Unable to connect to the database:', error);
  }
}
module.exports = initializeApp;
