import logo from './logo.svg';
import './App.css';
import Menu from './gamen/menu';  // Menuコンポーネントをインポート
import KeywordForm from './gamen/textbox';  // KeywordFormコンポーネントをインポート
import React, { useEffect } from 'react';  // ReactとuseEffectフックをインポート

// Appコンポーネントの定義
function App() {
  // useEffectフックを使用して、副作用的な処理を行う
  useEffect(() => {
    // 'keyword-added' イベントをリスン（監視）して、キーワードが追加されたときに実行する処理を設定
    window.electron.ipcRenderer.on('keyword-added', (event, status) => {
      // statusというIDを持つHTML要素を取得
      const statusElement = document.getElementById('status');
      if (statusElement) {
        // その要素に追加されたキーワードの状態を表示
        statusElement.textContent = status;
      }
    });

    // 'delete-success' イベントをリスンして、削除が成功したときにアラートを表示
    window.electron.ipcRenderer.on('delete-success', (event, message) => {
      alert(message || "すべて消えた");
    });

    // 'delete-error' イベントをリスンして、削除が失敗したときにエラーメッセージを表示
    window.electron.ipcRenderer.on('delete-error', (event, message) => {
      alert(`Error: ${message}`);
    });

    // コンポーネントがアンマウントされる際に実行されるクリーンアップ処理
    return () => {
      // 'keyword-added' イベントリスナーを削除
      window.electron.ipcRenderer.removeAllListeners('keyword-added');
      // 'delete-success' イベントリスナーを削除
      window.electron.ipcRenderer.removeAllListeners('delete-success');
      // 'delete-error' イベントリスナーを削除
      window.electron.ipcRenderer.removeAllListeners('delete-error');
    };
  }, []);  // 空の依存配列により、このuseEffectはコンポーネントのマウント時にのみ実行される

  return (
    <div className="App">
      <header className="App-header">
        {/* ロゴ画像を表示 */}
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <div className="App-content">
        {/* Menuコンポーネントを表示 */}
        <Menu />
        {/* KeywordFormコンポーネントを表示 */}
        <KeywordForm />
        {/* キーワードの追加結果を表示するための要素 */}
        <div id="status"></div>
      </div>
    </div>
  );
  
}

// Appコンポーネントをエクスポート
export default App;
