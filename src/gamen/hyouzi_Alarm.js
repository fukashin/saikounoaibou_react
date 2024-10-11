import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import '../CSS/Keyword_Active.css';
import { CSSTransition } from 'react-transition-group';
import '../CSS/ModalAnimations.css'; // イージング用のスタイルを追加

Modal.setAppElement('#root'); // アクセシビリティ対応の設定

function AlarmList() {
  // アラームのリストを保持する状態変数
  const [alarms, setAlarms] = useState([]);
  // 選択されたアクティビティの情報を保持する状態変数
  const [selectedActivity, setSelectedActivity] = useState(null);
  // モーダルの表示状態を管理する状態変数
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 新規アラーム入力用の状態変数
  const [isNewAlarmModalOpen, setIsNewAlarmModalOpen] = useState(false);
  const [newAlarmData, setNewAlarmData] = useState({
    alarmName: '',
    description: '',
    windowName: '',
    thresholdTime: 0,
    isEnabled: true
  });

  useEffect(() => {
    try {
      // アラーム設定情報を取得するリクエストをメインプロセスに送信
      window.electron.ipcRenderer.send('get-Alarms');

      // アラーム設定リストを受け取るリスナーを設定
      window.electron.ipcRenderer.on('Alarm-list', (data) => {
        try {
          if (Array.isArray(data)) {
            console.log('Received Alarm data:', data); // デバッグ用ログ
            setAlarms(data); // 取得したアラーム情報を状態に保存
          } else {
            throw new Error('Received data is not an array');
          }
        } catch (error) {
          console.error('Error processing Alarm-list data:', error);
        }
      });
    } catch (error) {
      console.error('Error in useEffect:', error);
    }

    // クリーンアップ処理 - コンポーネントがアンマウントされる際にリスナーを削除
    return () => {
      window.electron.ipcRenderer.removeAllListeners('Alarm-list');
    };
  }, []); // 初回レンダリング時のみ実行

  // アラーム項目がクリックされたときの処理
  const handleAlarmClick = (activity) => {
    try {
      setSelectedActivity(activity); // 選択されたアクティビティを設定
      setIsModalOpen(true); // モーダルを開く
    } catch (error) {
      console.error('Error in handleAlarmClick:', error);
    }
  };

  // 新規ボタンがクリックされたときの処理
  const handleNewAlarmClick = () => {
    if (!isNewAlarmModalOpen && !isModalOpen){
    try {
      console.log('モーダルを開きます');
      setIsNewAlarmModalOpen(true); // 新規アラームモーダルを開く
    } catch (error) {
      console.error('Error in handleNewAlarmClick:', error);
    }
  }
};

  // 新規アラームモーダルを閉じる処理
  const handleNewAlarmModalClose = () => {
    try {
      setIsNewAlarmModalOpen(false); // 新規アラームモーダルを閉じる
      setNewAlarmData({
        alarmName: '',
        description: '',
        windowName: '',
        thresholdTime: 0,
        isEnabled: true
      }); // 入力データをクリア
    } catch (error) {
      console.error('Error in handleNewAlarmModalClose:', error);
    }
  };

  // 新規アラーム入力変更の処理
  const handleNewAlarmChange = (e) => {
    try {
      const { name, value, type, checked } = e.target;
      setNewAlarmData((prevData) => ({
        ...prevData,
        [name]: type === 'checkbox' ? checked : value
      }));
    } catch (error) {
      console.error('Error in handleNewAlarmChange:', error);
    }
  };

  // 新規アラームを保存する処理
  const handleNewAlarmSubmit = (e) => {
    try {
      e.preventDefault();
      window.electron.ipcRenderer.send('add-alarm', newAlarmData);
      handleNewAlarmModalClose(); // モーダルを閉じる
    } catch (error) {
      console.error('Error in handleNewAlarmSubmit:', error);
    }
  };

  // モーダルを閉じる処理
  const handleModalClose = () => {
    try {
      setIsModalOpen(false); // モーダルを閉じる
      setSelectedActivity(null); // 選択されたアクティビティをクリア
    } catch (error) {
      console.error('Error in handleModalClose:', error);
    }
  };

  // アラーム設定を保存する処理
  const handleSaveAlarm = (thresholdTime) => {
    try {
      // アラーム設定の保存リクエストをメインプロセスに送信
      window.electron.ipcRenderer.send('save-Alarm', {
        windowName: selectedActivity.windowName, // 選択されたウィンドウ名
        thresholdTime, // 閾値時間
      });
      setIsModalOpen(false); // モーダルを閉じる
      setSelectedActivity(null); // 選択されたアクティビティをクリア
    } catch (error) {
      console.error('Error in handleSaveAlarm:', error);
    }
  };

  return (
    <div>
      <h2>アラーム設定リスト</h2>

      <button onClick={handleNewAlarmClick}>新規</button>

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

        <Modal
          isOpen={isModalOpen}
          onRequestClose={handleModalClose}
          contentLabel="アラーム設定"
          className="modal"
          overlayClassName="modal-overlay"
        >
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
        </Modal>

      {/* 新規アラーム登録モーダル */}
        <Modal
          isOpen={isNewAlarmModalOpen}
          onRequestClose={handleNewAlarmModalClose}
          contentLabel="新規アラーム登録"
          className="modal"
          overlayClassName="modal-overlay"
        >
          <div className="alarm-input-container">
            <h2>新規アラームの登録</h2>
            <form onSubmit={handleNewAlarmSubmit}>
              <div className="form-group">
                <label htmlFor="alarmName">アラーム名:</label>
                <input
                  type="text"
                  id="alarmName"
                  name="alarmName"
                  value={newAlarmData.alarmName}
                  onChange={handleNewAlarmChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">説明:</label>
                <textarea
                  id="description"
                  name="description"
                  value={newAlarmData.description}
                  onChange={handleNewAlarmChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="windowName">ウィンドウ名:</label>
                <input
                  type="text"
                  id="windowName"
                  name="windowName"
                  value={newAlarmData.windowName}
                  onChange={handleNewAlarmChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="thresholdTime">閾値時間 (秒):</label>
                <input
                  type="number"
                  id="thresholdTime"
                  name="thresholdTime"
                  value={newAlarmData.thresholdTime}
                  onChange={handleNewAlarmChange}
                  min="0"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="isEnabled">アラームを有効にする:</label>
                <input
                  type="checkbox"
                  id="isEnabled"
                  name="isEnabled"
                  checked={newAlarmData.isEnabled}
                  onChange={handleNewAlarmChange}
                />
              </div>
              <button type="submit">登録</button>
              <button type="button" onClick={handleNewAlarmModalClose}>キャンセル</button>
            </form>
          </div>
        </Modal>
    </div>
  );
}

export default AlarmList;