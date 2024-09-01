const { ipcMain, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow = null;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 900,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,  // これで安全に使えます
            enableRemoteModule: false,
            nodeIntegration: false   // セキュリティのため無効化
        }
    });

    mainWindow.loadFile(path.join(__dirname, '../index.html')); // 初期画面をロード
}

// 画面を切り替えるIPCハンドラーを設定
ipcMain.on('アクティブ表示画面に遷移', () => {
    if (mainWindow) {
        mainWindow.loadFile(path.join(__dirname, '../gamen/active.html'));
    }
});

ipcMain.on('キーワード表示画面に遷移', () => {
    if (mainWindow) {
        mainWindow.loadFile(path.join(__dirname, '../gamen/keyword.html'));
    }
});

ipcMain.on('メインメニュー画面に遷移', () => {
    if (mainWindow) {
        mainWindow.loadFile(path.join(__dirname, '../index.html'));
    }
});

module.exports = createWindow ;
