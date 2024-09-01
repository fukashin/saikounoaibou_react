const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  let mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // preloadスクリプトがある場合
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // React開発サーバーをロード
  mainWindow.loadURL('http://localhost:3000');  // Reactの開発サーバーURL

  // 開発者ツールを開く（必要に応じてコメントアウト）
//   mainWindow.webContents.openDevTools();

  // ウィンドウが閉じられた時の処理
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

// Electronが初期化されたときにウィンドウを作成
app.on('ready', createWindow);

// 全てのウィンドウが閉じられた時の処理
app.on('window-all-closed', function () {
  // macOS では Cmd + Q でアプリを終了するまでアプリを終了させない
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // macOS で dock アイコンがクリックされ、他にウィンドウが開いていない場合に再作成する
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
