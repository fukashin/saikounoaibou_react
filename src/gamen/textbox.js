import React, { useState, useEffect } from 'react';

function KeywordForm() {
  const [keyword, setKeyword] = useState('');
  const [statusMessage, setStatusMessage] = useState(''); // 送信結果のメッセージ用

  const handleSubmit = (event) => {
    event.preventDefault();
    window.electron.ipcRenderer.send('add-keyword', keyword);
  };

  useEffect(() => {
    // 'add-success' イベントをリスンして、作成が成功したときにメッセージを表示
    window.electron.ipcRenderer.on('add-success', (message) => {
      setStatusMessage(`成功: ${message}`);
      setKeyword(''); // テキストボックスを初期化
    });

    // 'add-error' イベントをリスンして、作成が失敗したときにエラーメッセージを表示
    window.electron.ipcRenderer.on('add-error', (message) => {
      setStatusMessage(`エラー: ${message}`);
    });

    // クリーンアップ処理
    return () => {
      window.electron.ipcRenderer.removeAllListeners('add-success');
      window.electron.ipcRenderer.removeAllListeners('add-error');
    };
  }, []);

  return (
    <form id="キーワード入力" onSubmit={handleSubmit}>
      <input
        type="text"
        id="keyword"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="キーワードを入力"
      />
      <button type="submit">送信</button>
      {/* 送信結果メッセージの表示 */}
      {statusMessage && <p>{statusMessage}</p>}
    </form>
  );
}

export default KeywordForm;
