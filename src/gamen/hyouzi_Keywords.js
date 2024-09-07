import React, { useEffect, useState } from 'react';
import '../CSS/Keyword_Active.css'

function KeywordList() {
  // キーワードの状態を管理。初期値は空の配列。
  const [keywords, setKeywords] = useState([]);

  useEffect(() => {
    // メインプロセスからキーワードリストを取得
    window.electron.ipcRenderer.send('get-keywords');
    // console.log('window.electron:', window.electron);

    // キーワードリストを受け取る
// キーワードリストを受け取る
  window.electron.ipcRenderer.on('keywords-list', (event) => {
  // console.log('Received in renderer (event):', event); // デバッグ用のログ出力

  if (Array.isArray(event)) {  // 受け取ったデータが配列かどうか確認
    event.forEach((item, index) => {
      // console.log(`Item ${index}:`, item); // 各要素をログに出力してデバッグ
    });

    const formattedData = event.map(item => item.dataValues || item); // dataValues がない場合はそのまま使う
    setKeywords(formattedData); // 取得したキーワードを状態に保存
  } else {
    console.error('Received data is not an array:', event);
  }
});
    // クリーンアップ処理
    return () => {
      window.electron.ipcRenderer.removeAllListeners('keywords-list');
      window.electron.ipcRenderer.removeAllListeners('keywords-error');
      window.electron.ipcRenderer.removeAllListeners('test-reply');
    };
  }, []);



  return (
    <div>
      <h2>キーワードリスト</h2>

      <ul>
        {keywords.length > 0 ? (
          keywords.map((keyword, index) => (
            <li key={index}>
            <div>
            <strong>ID:</strong> {keyword.id}<br />
            </div>
            <div>
            <strong>Word:</strong> {keyword.word}<br />
            <div>
            </div>
            <strong>Created At:</strong> {new Date(keyword.createdAt).toLocaleString()}<br />
            <div>
            </div>
            <strong>Updated At:</strong> {new Date(keyword.updatedAt).toLocaleString()}<br />
            </div>
          </li>
          ))
        ) : (
          <li>キーワードがありません</li>
        )}
      </ul>
    </div>
  );
}

export default KeywordList;
