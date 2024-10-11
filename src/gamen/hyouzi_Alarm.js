import React, { useState, useEffect } from 'react';

function AlarmList() {
  // アラームのリストを保持する状態変数
  const [alarms, setAlarms] = useState([]);
  // 選択されたアクティビティの情報を保持する状態変数
  const [selectedActivity, setSelectedActivity] = useState(null);
  // モーダルの表示状態を管理する状態変数
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // アラーム設定情報を取得するリクエストをメインプロセスに送信
    window.electron.ipcRenderer.send('get-Alarms');

    // アラーム設定リストを受け取るリスナーを設定
    window.electron.ipcRenderer.on('Alarm-list', (data) => {
      if (Array.isArray(data)) {
        console.log('Received Alarm data:', data); // デバッグ用ログ
        setAlarms(data); // 取得したアラーム情報を状態に保存
      } else {
        console.error('Received data is not an array:', data); // エラーハンドリング
      }
    });

    // クリーンアップ処理 - コンポーネントがアンマウントされる際にリスナーを削除
    return () => {
      window.electron.ipcRenderer.removeAllListeners('Alarm-list');
    };
  }, []); // 初回レンダリング時のみ実行

  // アラーム項目がクリックされたときの処理
  const handleAlarmClick = (activity) => {
    setSelectedActivity(activity); // 選択されたアクティビティを設定
    setIsModalOpen(true); // モーダルを開く
  };

  // モーダルを閉じる処理
  const handleModalClose = () => {
    setIsModalOpen(false); // モーダルを閉じる
    setSelectedActivity(null); // 選択されたアクティビティをクリア
  };

  // アラーム設定を保存する処理
  const handleSaveAlarm = (thresholdTime) => {
    // アラーム設定の保存リクエストをメインプロセスに送信
    window.electron.ipcRenderer.send('save-Alarm', {
      windowName: selectedActivity.windowName, // 選択されたウィンドウ名
      thresholdTime, // 閾値時間
    });
    setIsModalOpen(false); // モーダルを閉じる
    setSelectedActivity(null); // 選択されたアクティビティをクリア
  };

  return (
    <div>
      <h2>アラーム設定リスト</h2>

      <a href="#"
       id="新規"
      className="btn btn-flat2" >
        <span>新規</span>
      </a>

      <ul>
        {/* アラームリストの項目を表示 */}
        {alarms.map((alarm, index) => (
          <li key={index} onClick={() => handleAlarmClick(alarm)}>
            <div>
              <strong>ウィンドウ名:</strong> {alarm.windowName}<br />
            </div>
            <div>
              <strong>閾値時間:</strong> {alarm.thresholdTime} 分<br />
            </div>
          </li>
        ))}
      </ul>

      {/* モーダルが開いている場合に表示 */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>アラーム設定: {selectedActivity?.windowName}</h3>
            <label>
              閾値時間（分）:
              <input
                type="number"
                onChange={(e) => setSelectedActivity({ ...selectedActivity, thresholdTime: e.target.value })} // 入力値の変更を状態に反映
              />
            </label>
            <button onClick={() => handleSaveAlarm(selectedActivity.thresholdTime)}>保存</button> {/* アラーム設定を保存するボタン */}
            <button onClick={handleModalClose}>キャンセル</button> {/* モーダルを閉じるボタン */}
          </div>
        </div>
      )}
    </div>
  );
}

export default AlarmList;