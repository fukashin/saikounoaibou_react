const path = require('path');
const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const os = require('os');

// ログ出力用の関数
function logMessage(message) {
  const logPath = path.join(app.getPath('userData'), 'log.txt');  // 'userData' はアプリの書き込み可能なディレクトリ
  fs.appendFileSync(logPath, `${new Date().toISOString()} - ${message}\n`);
}

// アプリケーション起動時にログを出力
logMessage('App is starting');

// 動的インポートを使って isDev をロード
async function loadModules() {
  try {
    logMessage('Loading isDev module...');
    const { default: isDev } = await import('electron-is-dev');
    logMessage(`isDev loaded: ${isDev}`);

    // 絶対パスでモジュールを読み込む
    logMessage('Resolving module paths...');
    
    // パスの解決に path.resolve() を使用してアプリの起動ディレクトリを基準に絶対パスを取得
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

    // 各モジュールを読み込む
    logMessage('Loading modules...');
    const initializeAppModule = require(servicesPath);
    const initializeApp = initializeAppModule.default || initializeAppModule;

    const handlersModule = require(handlersPath);
    const setupIpcHandlers = handlersModule.default || handlersModule;

    const gamenKirikaeModule = require(gamenKirikaePath);
    const createWindow = gamenKirikaeModule.default || gamenKirikaeModule;

    logMessage('Modules loaded successfully');

    // 初期化処理を行う
    logMessage('Initializing app...');
    initializeApp();
    logMessage('App initialized');
    
    logMessage('Creating window...');
    createWindow();
    logMessage('Window created');

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
    // モジュールの読み込みと初期化を実行
    await loadModules();
  } catch (error) {
    logMessage(`Error during app initialization: ${error}`);
  }
});

app.on('window-all-closed', function () {
  logMessage('All windows closed');
  if (process.platform !== 'darwin') {
    logMessage('Quitting app');
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
