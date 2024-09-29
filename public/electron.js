const path = require('path');
const { app, BrowserWindow, Tray, Menu } = require('electron'); // Tray と Menu を追加
const fs = require('fs');
const os = require('os');

let tray = null; // トレイの変数を追加

// ログ出力用の関数
function logMessage(message) {
  const logPath = path.join(app.getPath('userData'), 'log.txt');  // 'userData' はアプリの書き込み可能なディレクトリ
  fs.appendFileSync(logPath, `${new Date().toISOString()} - ${message}\n`);
}

// トレイアイコンの設定関数
function createTray(mainWindow) {
  try {
    tray = new Tray(path.join(__dirname, 'アイコン.png')); // ここにテスト用の .ico パスを指定

    if (tray === null) {
      throw new Error('Tray creation failed: tray is null');
    }

    const contextMenu = Menu.buildFromTemplate([
      { label: '表示', click: () => { mainWindow.show(); } },
      { 
        label: '終了', 
        click: () => {
          app.isQuiting = true;
      
          // すべてのイベントリスナーをクリア
          app.removeAllListeners();
      
          // トレイアイコンの破棄
          if (tray) tray.destroy();
      
          // すべてのウィンドウを閉じる
          BrowserWindow.getAllWindows().forEach(win => win.close());
          
          // アプリケーションのプロセスを強制的に終了
          process.exit(0);
        }
      }
      
      
    ]);
    tray.setContextMenu(contextMenu);
    tray.setToolTip('最高の相棒');

  } catch (error) {
    logMessage(`Error during tray creation: ${error}`);
  }  
  // トレイのクリックでウィンドウを表示/非表示する
  tray.on('click', () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
  });
  
}



// 動的インポートを使って isDev をロード
async function loadModules() {
  try {
    logMessage('Loading isDev module...');
    const { default: isDev } = await import('electron-is-dev');
    logMessage(`isDev loaded: ${isDev}`);

    logMessage('Resolving module paths...');
    
    const servicesPath = isDev
      ? path.resolve(__dirname, '../resources/services/initializeapp')  // 開発環境
      : path.resolve(__dirname, '../../../resources/services/initializeapp'); // パッケージ化後

    const handlersPath = isDev
      ? path.resolve(__dirname, '../resources/handlers/handlers')  // 開発環境
      : path.resolve(__dirname, '../../../resources/handlers/handlers');  // パッケージ化後

    const gamenKirikaePath = isDev
      ? path.resolve(__dirname, '../resources/handlers/gamenkirikae_handlers')  // 開発環境
      : path.resolve(__dirname, '../../../resources/handlers/gamenkirikae_handlers');  // パッケージ化後

    logMessage(`Module paths resolved:
    servicesPath: ${servicesPath},
    handlersPath: ${handlersPath},
    gamenKirikaePath: ${gamenKirikaePath}`);

    logMessage('Loading modules...');
    const initializeAppModule = require(servicesPath);
    const initializeApp = initializeAppModule.default || initializeAppModule;

    const handlersModule = require(handlersPath);
    const setupIpcHandlers = handlersModule.default || handlersModule;

    const gamenKirikaeModule = require(gamenKirikaePath);
    const createWindow = gamenKirikaeModule.default || gamenKirikaeModule;

    logMessage('Modules loaded successfully');

    logMessage('Creating window...');
    // 非同期関数で `await` を使用
    const mainWindow = await createWindow();
    logMessage('Window created');

    // システムトレイの設定
    createTray(mainWindow); // トレイアイコンを作成

    logMessage('Initializing app...');
    initializeApp();
    logMessage('App initialized');
    
    logMessage('Setting up IPC handlers...');
    setupIpcHandlers();
    logMessage('IPC handlers set up');

  } catch (error) {
    logMessage(`Error during module loading: ${error}`);
    throw error;  // エラーを再スローして、後で処理されるようにする
  }
}

app.on('ready', async () => {
  try {
    logMessage('App is ready, loading modules...');
    await loadModules();
  } catch (error) {
    logMessage(`Error during app initialization: ${error}`);
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin' || app.isQuiting) {
    app.quit();
  }
});


app.on('activate', async function () {
  logMessage('App activated');
  if (BrowserWindow.getAllWindows().length === 0) {
    try {
      logMessage('No windows found, creating a new one...');
      await loadModules();
    } catch (error) {
      logMessage(`Error during window creation: ${error}`);
    }
  }
});

