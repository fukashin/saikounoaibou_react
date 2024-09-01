const { app, BrowserWindow } = require('electron');

// ホットリロードの設定ここから
const path = require('path');
require('electron-reload')(path.join(__dirname, './src'), {
  // Electronの実行ファイルのパスを明示的に指定
  electron: path.join(__dirname, './node_modules/electron/dist/electron.exe'),
  ignored: /node_modules|[/\\]\./
});

// ホットリロードの設定ここまで

function createWindow() {
  let mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadURL('http://localhost:3000');
//   mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

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
