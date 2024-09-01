const { ipcMain, BrowserWindow, screen } = require('electron');
const path = require('path');

let mainWindow = null;

function createWindow() {
    // すべてのディスプレイの情報を取得
    const displays = screen.getAllDisplays();
  
    // サブディスプレイの右上に表示するためのディスプレイを選択
    // ここでは2つ目のディスプレイをサブディスプレイと仮定
    const externalDisplay = displays.find((display) => display.bounds.x !== 0 || display.bounds.y !== 0);
  
    let x = 0, y = 0;
    
    if (externalDisplay) {
      // サブディスプレイの右上の座標を計算
      x = externalDisplay.bounds.x + externalDisplay.bounds.width - 800; // ウィンドウ幅を800と仮定
      y = externalDisplay.bounds.y; // 上部はそのまま
    }
  
    let mainWindow = new BrowserWindow({
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
  
    mainWindow.loadURL('http://localhost:3000');
    // mainWindow.webContents.openDevTools();
  
    mainWindow.on('closed', function () {
      mainWindow = null;
    });
  }

  


module.exports = createWindow ;
