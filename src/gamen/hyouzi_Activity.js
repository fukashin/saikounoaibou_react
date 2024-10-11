import React, { useEffect, useState } from 'react';
import '../CSS/Keyword_Active.css';
import '../CSS/menu.css';
import moment from 'moment-timezone';

function ActivityList() {
  const [activities, setActivities] = useState([]);
  const [viewType, setViewType] = useState('day'); // 初期表示は当日
  const [day, setDay] = useState(null);
  const [week, setWeek] = useState(null);
  const [month, setMonth] = useState(null);

  useEffect(() => {
    // 実行時に日付、週、月を取得
    const now = moment.tz("Asia/Tokyo");
    setDay(now.date()); // 日
    setWeek(now.week()); // 週番号
    setMonth(now.month() + 1); // 月 (moment は 0 ベースなので +1)
  }, []);

  useEffect(() => {
    // 初回実行
    if (viewType && day !== null && week !== null && month !== null) {
      if(viewType === 'day'){
        console.log(`Sending request for ${viewType} with day=${day}, week=${week}, month=${month}`);
        window.electron.ipcRenderer.send('get-Activity_day', day);
        console.log(`当日`);
      } else if (viewType === 'week') {
        window.electron.ipcRenderer.send('get-Activity_week', week);
        console.log(`当週`);
      } else if (viewType === 'month') {
        window.electron.ipcRenderer.send('get-Activity_month', month);
        console.log(`当月`);
      }
    }
  
    // その後10秒おきに繰り返し処理を行う
    const intervalId = setInterval(() => {
      if (viewType && day !== null && week !== null && month !== null) {
        if(viewType === 'day'){
          console.log(`Sending request for ${viewType} with day=${day}, week=${week}, month=${month}`);
          window.electron.ipcRenderer.send('get-Activity_day', day);
          console.log(`当日`);
        } else if (viewType === 'week') {
          window.electron.ipcRenderer.send('get-Activity_week', week);
          console.log(`当週`);
        } else if (viewType === 'month') {
          window.electron.ipcRenderer.send('get-Activity_month', month);
          console.log(`当月`);
        }
      }
    }, 10000); // 10秒おき

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
      clearInterval(intervalId);
    };
  }, [viewType, day, week, month]); // `viewType` が変わったときに再実行

  const handleDelete = (id, event) => {
    event.preventDefault(); // デフォルトの動作を抑えて画面移動を防ぐ
    // アクティビティ削除のリクエストをメインプロセスに送る
    const userConfirmed = window.confirm("削除する?");
    if (userConfirmed) {
      window.electron.ipcRenderer.send('delete-Activity', id);
    }
    window.electron.ipcRenderer.send('get-keywords');
    window.electron.ipcRenderer.send('get-Activity');
  };

  // 更新ボタンのクリックハンドラ
  const handleUpdateClick = () => {
    if (viewType === 'day') {
      window.electron.ipcRenderer.send('get-Activity_day', day);
      console.log('Updating 日別');
    } else if (viewType === 'week') {
      window.electron.ipcRenderer.send('get-Activity_week', week);
      console.log('Updating 週別');
    } else if (viewType === 'month') {
      window.electron.ipcRenderer.send('get-Activity_month', month);
      console.log('Updating 月別');
    }
  };

  // 画面切り替え用のボタン
  const renderButtons = () => (
    <div>
      <a href="#"
       id="日別"
      className="btn btn-flat2" 
      onClick={() => setViewType('day')}>
        <span>日別</span>
      </a>
      <a href="#"
       id="日別"
      className="btn btn-flat2" 
      onClick={() => setViewType('week')}>
        <span>週別</span>
      </a>
      <a href="#"
       id="日別"
      className="btn btn-flat2" 
      onClick={() => setViewType('month')}>
        <span>月別</span>
      </a>
      {/* 更新ボタン */}
      <a href="#"
       id="更新"
      className="btn btn-flat2" 
      onClick={() => handleUpdateClick()}>
        <span>更新</span>
      </a>
    </div>
    
  );





  return (
    <div>
      {viewType === 'day' && <h2>日別リスト</h2>}
      {viewType === 'week' && <h2>週別リスト</h2>}
      {viewType === 'month' && <h2>月別リスト</h2>}

      {/* 表示切り替えボタン */}
      {renderButtons()}


    <ul className="scrollable-list">
      {activities.map((activity, index) => (
        <div className="draggable" draggable="true" key={index}>
          <li onClick={(e) => handleDelete(activity.id, e)}>
            <div>
              <strong>ウィンドウ名:</strong> {activity.windowName}<br />
            </div>
            <div>
              <strong>経過時間:</strong> {activity.activeTimeFormatted}<br />
            </div>
            {viewType === 'day' &&
            <div>
              <strong>最新更新時間:</strong> {new Date(activity.updatedAt).toLocaleString()}<br />
            </div>
            }
          </li>
        </div>
      ))}
    </ul>

    </div>
  );
}

export default ActivityList;
