import logo from './logo.svg';
import './App.css';
import Menu from './gamen/menu';  // Menuコンポーネントをインポート
import KeywordForm from './gamen/textbox';  // KeywordFormコンポーネントをインポート
import KeywordList from './gamen/hyouzi_Keywords';
import ActivitydList from './gamen/hyouzi_Activity';
import React, { useEffect } from 'react';  // ReactとuseEffectフックをインポート

// Appコンポーネントの定義
function App() {
  // useEffectフックを使用して、副作用的な処理を行う
  useEffect(() => {
    

    // 'delete-success' イベントをリスンして、削除が成功したときにアラートを表示
    window.electron.ipcRenderer.on('delete-success', (message) => {
      alert(message );
    });

    // 'delete-error' イベントをリスンして、削除が失敗したときにエラーメッセージを表示
    window.electron.ipcRenderer.on('delete-error', (message) => {
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

        <KeywordList />
        <ActivitydList />
        <div id="status"></div>
      </div>
    </div>
  );
  
}

// Appコンポーネントをエクスポート
export default App;
