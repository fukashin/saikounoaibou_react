import React from 'react';

function Menu({ onViewChange }) {
  const handleClick = (action) => {
    if (action === 'delete-all-keyword-records' || action === 'delete-all-records') {
      const userConfirmed = window.confirm("全部消えるけど、ほんとに削除する?");
      if (userConfirmed) {
        window.electron.ipcRenderer.send(action);
      }
    } else if (action === 'get-Activity') {
      onViewChange('activity'); // 親にアクティビティの表示を依頼
    } else if (action === 'get-keywords') {
      onViewChange('keyword'); // 親にキーワードリストの表示を依頼
    } else {
      window.electron.ipcRenderer.send(action);
    }
  };

  return (
    <div id="menu">
      <a href="#" id="メインメニューボタン" className="btn btn-flat" onClick={() => handleClick('メインメニュー画面に遷移')}>
        <span>メインメニュー</span>
      </a>
      <a href="#" id="アクティブ表示ボタン" className="btn btn-flat" onClick={() => handleClick('get-Activity')}>
        <span>アクティブ表示ボタン</span>
      </a>
      <a href="#" id="キーワード表示ボタン" className="btn btn-flat" onClick={() => handleClick('get-keywords')}>
        <span>キーワード表示ボタン</span>
      </a>
      <a href="#" id="全アクティブ削除ボタン" className="btn btn-flat" onClick={() => handleClick('delete-all-records')}>
        <span>アクティブをすべて削除</span>
      </a>
      <a href="#" id="全キーワード削除ボタン" className="btn btn-flat" onClick={() => handleClick('delete-all-keyword-records')}>
        <span>全キーワードをすべて削除</span>
      </a>
    </div>
  );
}

export default Menu;
