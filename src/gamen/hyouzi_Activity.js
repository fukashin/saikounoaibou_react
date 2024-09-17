import React, { useEffect, useState } from 'react';
import '../CSS/Keyword_Active.css'

function ActivityList() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // メインプロセスからアクティビティリストを取得
    window.electron.ipcRenderer.send('get-Activity');

    // アクティビティリストを受け取る
    window.electron.ipcRenderer.on('Activity-list', (data) => {
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

  const handleDelete = (id,event) => {
    event.preventDefault(); // デフォルトの動作を抑えて画面移動を防ぐ
    // アクティビティ削除のリクエストをメインプロセスに送る
    const userConfirmed = window.confirm("削除する?");
    if (userConfirmed) {
      window.electron.ipcRenderer.send('delete-Activity', id);
    }
    window.electron.ipcRenderer.send('get-keywords');
    window.electron.ipcRenderer.send('get-Activity');
    
  };

  return (
    <div>
      <h2>アクティビティリスト</h2>
      
      <ul>
        {activities.map((activity, index) => (
          <li key={index} onClick={(e) => handleDelete(activity.id,e)}>
            {/* <strong>ID:</strong> {activity.id}<br /> */}
            <div>
              <strong>ウィンドウ名:</strong> {activity.windowName}<br />
            </div>
            <div>
              <strong>経過時間:</strong> {activity.activeTimeFormatted}<br />
            </div>
            {/* <strong>新規作成の時間:</strong> {new Date(activity.createdAt).toLocaleString()}<br /> */}
            <div>
              <strong>最新更新時間:</strong> {new Date(activity.updatedAt).toLocaleString()}<br /> 
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ActivityList;
