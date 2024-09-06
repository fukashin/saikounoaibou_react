import React, { useEffect, useState } from 'react';

function ActivityList() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // メインプロセスからアクティビティリストを取得
    window.electron.ipcRenderer.send('get-Activity');

    // アクティビティリストを受け取る
    window.electron.ipcRenderer.on('Activity-list', ( data) => {
      if (Array.isArray(data)) {
        console.log('Received in renderer (data):', data); // デバッグ用のログ出力
        const formattedData = data.map(item => item.dataValues || item); // dataValues がない場合はそのまま使う
        setActivities(formattedData); // 取得したアクティビティを状態に保存
      } else {
        console.error('Received data is not an array:', data);
      }
    });

    // エラーメッセージを受け取る
    window.electron.ipcRenderer.on('Activity-error', (event, errorMessage) => {
      console.error(errorMessage);
    });

    // クリーンアップ処理
    return () => {
      window.electron.ipcRenderer.removeAllListeners('Activity-list');
      window.electron.ipcRenderer.removeAllListeners('Activity-error');
    };
  }, []);

  return (
    <div>
      <h2>アクティビティリスト</h2>
      
      <ul>
        {activities.map((activity, index) => (
          <li key={index}>
            <strong>ID:</strong> {activity.id}<br />
            <strong>ウィンドウ名:</strong> {activity.windowName}<br />
            <strong>経過時間:</strong> {activity.activeTime}<br />
            <strong>新規作成の時間:</strong> {new Date(activity.createdAt).toLocaleString()}<br />
            <strong>最新更新時間:</strong> {new Date(activity.updatedAt).toLocaleString()}<br />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ActivityList;
