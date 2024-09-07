import logo from './logo.svg';
import './CSS/App.css';
import Menu from './gamen/menu';  // Menuコンポーネントをインポート
import KeywordForm from './gamen/textbox';  // KeywordFormコンポーネントをインポート
import KeywordList from './gamen/hyouzi_Keywords';
import ActivitydList from './gamen/hyouzi_Activity';
import React, { useEffect ,useState } from 'react';  // ReactとuseEffectフックをインポート

// Appコンポーネントの定義
function App() {
  const [activeView, setActiveView] = useState('activity'); // 表示内容の状態を管理

  const handleViewChange = (view) => {
    setActiveView(view); // 表示するコンポーネントを変更
    if (view === 'activity') {
      window.electron.ipcRenderer.send('get-Activity'); // 'get-Activity' イベントを送信
    }
  };



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
        <Menu onViewChange={handleViewChange} /> {/* Menuに関数を渡す */}
        {/* KeywordFormコンポーネントを表示 */}
        <KeywordForm />
        {/* フラグに基づいて表示するコンポーネントを切り替え */}
        {activeView === 'activity' && <ActivitydList />}
        {activeView === 'keyword' && <KeywordList />}
        <div id="status"></div>
      </div>
    </div>
  );
  
}

// Appコンポーネントをエクスポート
export default App;
