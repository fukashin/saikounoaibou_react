const { ipcMain, BrowserWindow, screen } = require('electron');
const path = require('path');
const fs = require('fs');
let mainWindow = null;

// ログ出力用の関数
function logMessage(message) {
  const logPath = path.join(__dirname, 'log.txt');
  fs.appendFileSync(logPath, `${new Date().toISOString()} - ${message}\n`);
}

async function createWindow() {
  logMessage('createWindow start');
  
  // 動的に electron-is-dev をインポート
  const { default: isDev } = await import('electron-is-dev');
  logMessage(`isDev: ${isDev}`);

  // すべてのディスプレイの情報を取得
  const displays = screen.getAllDisplays();
  logMessage(`Number of displays: ${displays.length}`);
  
  // サブディスプレイの右上に表示するためのディスプレイを選択
  const externalDisplay = displays.find((display) => display.bounds.x !== 0 || display.bounds.y !== 0);
  let x = 0, y = 0;

  if (externalDisplay) {
    // サブディスプレイの右上の座標を計算
    x = externalDisplay.bounds.x + externalDisplay.bounds.width - 800; // ウィンドウ幅を800と仮定
    y = externalDisplay.bounds.y; // 上部はそのまま
    logMessage(`External display found, setting x: ${x}, y: ${y}`);
  } else {
    logMessage('No external display found, using default x and y');
  }

  mainWindow = new BrowserWindow({
    width: 800,
    height: 1200,
    x: x, // 計算されたX座標を設定
    y: y, // 計算されたY座標を設定
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,  // これで安全に使えます
      enableRemoteModule: false,
      nodeIntegration: false   // セキュリティのため無効化
    },
  });
  logMessage('BrowserWindow created');

  // URLの読み込み前にログを追加
  const urlToLoad = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../../resources/build/index.html')}`;
  
  logMessage(`Loading URL: ${urlToLoad}`);

  mainWindow.loadURL(urlToLoad);

  mainWindow.on('closed', function () {
    logMessage('Window closed');
    mainWindow = null;
  });
}

module.exports = createWindow;
