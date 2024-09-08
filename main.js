//データベースの接続と初期をインポート
const initializeApp = require('./services/initializeapp');
// 登録処理をインポート
const setupIpcHandlers = require('./handlers/handlers')
// 画面切り替えをインポート
const createWindow = require('./handlers/gamenkirikae_handlers')



const { app, BrowserWindow} = require('electron');
const path = require('path');
const { IGNORE } = require('sequelize/lib/index-hints');

// ホットリロードの設定ここから
require('electron-reload')(path.join(__dirname, 'src'), {
  electron: path.join(__dirname, './node_modules/electron/dist/electron.exe'),
  ignored: [
    /database\.sqlite$/, // SQLiteファイルを除外
    /node_modules/, // node_modulesを除外
    /.*\.log$/, // ログファイルも除外
  ]
});
// ホットリロードの設定ここまで



app.on('ready', initializeApp);
app.on('ready',createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});


// IPCハンドラーの設定
setupIpcHandlers();//これは必要っぽい
