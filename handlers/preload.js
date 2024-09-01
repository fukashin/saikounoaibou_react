// preload.js
//ここではHTMLでjavascriptを呼び出す際に、呼び出すことができる
// メソッドをここで定義する
// セキュリティーが高くなるらしい
//ここを読み込ませたら行けた　https://www.electronjs.org/ja/docs/latest/tutorial/tutorial-preload
const { contextBridge, ipcRenderer } = require('electron');

// 安全に ipcRenderer をレンダラープロセスに渡す
contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    send: (channel, data) => ipcRenderer.send(channel, data),
    on: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args))
  }
});
