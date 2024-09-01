import React, { useState } from 'react';

function KeywordForm() {
  const [keyword, setKeyword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    window.electron.ipcRenderer.send('add-keyword', keyword);
  };

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
    </form>
  );
}

export default KeywordForm;
