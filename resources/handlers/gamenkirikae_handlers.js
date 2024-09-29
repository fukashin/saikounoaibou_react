const { ipcMain, BrowserWindow, screen } = require('electron');
const path = require('path');
const fs = require('fs');
let mainWindow = null;

// ログ出力用の関数


async function createWindow() {
  
  // 動的に electron-is-dev をインポート
  const { default: isDev } = await import('electron-is-dev');

  // すべてのディスプレイの情報を取得
  const displays = screen.getAllDisplays();
  
  // サブディスプレイの右上に表示するためのディスプレイを選択
  const externalDisplay = displays.find((display) => display.bounds.x !== 0 || display.bounds.y !== 0);
  let x = 0, y = 0;

  if (externalDisplay) {
    // サブディスプレイの右上の座標を計算
    x = externalDisplay.bounds.x + externalDisplay.bounds.width - 800; // ウィンドウ幅を800と仮定
    y = externalDisplay.bounds.y; // 上部はそのまま

  } else {

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
  


  // URLの読み込み前にログを追加
  const urlToLoad = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../../resources/build/index.html')}`;
  
 

  mainWindow.loadURL(urlToLoad);

  mainWindow.on('close', (event) => {
      event.preventDefault();
      mainWindow.hide();  // ウィンドウを隠す
  });
  return mainWindow; // `mainWindow` を返す
}

module.exports = createWindow;
