import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import '../CSS/Keyword_Active.css';
import NewAlarmModal from './modal/NewAlarmModal'; // 新規アラームモーダルをインポート

Modal.setAppElement('#root');

function AlarmList() {
  const [alarms, setAlarms] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewAlarmModalOpen, setIsNewAlarmModalOpen] = useState(false);
  const [newAlarmData, setNewAlarmData] = useState({
    alarmName: '',
    description: '',
    windowName: '',
    thresholdTimeHours: 0,  // 時間の初期値
    thresholdTimeMinutes: 0,  // 分の初期値
    isEnabled: true,
  });

  useEffect(() => {
    window.electron.ipcRenderer.send('get-Alarms');
    window.electron.ipcRenderer.on('Alarm-list', (data) => {
      if (Array.isArray(data)) {
        setAlarms(data);
      }
    });

    return () => {
      window.electron.ipcRenderer.removeAllListeners('Alarm-list');
    };
  }, []);

  const handleAlarmClick = (activity) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  };

  const handleNewAlarmClick = () => {
    setIsNewAlarmModalOpen(true);
  };

  const handleNewAlarmModalClose = () => {
    setIsNewAlarmModalOpen(false);
    setNewAlarmData({
      alarmName: '',
      description: '',
      windowName: '',
      thresholdTimeHours: 0,  // 時間をリセット
      thresholdTimeMinutes: 0,  // 分をリセット
      isEnabled: true,
    });
  };

  const handleNewAlarmChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAlarmData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // 新規アラームの保存処理
  const handleNewAlarmSubmit = (e) => {
    e.preventDefault();

    // 時間と分を秒に変換
    const totalSeconds =
      (parseInt(newAlarmData.thresholdTimeHours, 10) || 0) * 3600 +
      (parseInt(newAlarmData.thresholdTimeMinutes, 10) || 0) * 60;

    // 秒単位の閾値を設定してデータを送信
    window.electron.ipcRenderer.send('add-alarm', {
      ...newAlarmData,
      thresholdTime: totalSeconds,
    });

    handleNewAlarmModalClose(); // モーダルを閉じる
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedActivity(null);
  };

  const handleSaveAlarm = (thresholdTime) => {
    window.electron.ipcRenderer.send('save-Alarm', {
      windowName: selectedActivity.windowName,
      thresholdTime,
    });
    setIsModalOpen(false);
    setSelectedActivity(null);
  };

  return (
    <div>
      <h2>アラーム設定リスト</h2>
      <button onClick={handleNewAlarmClick}>新規</button>

      {/* 新規アラーム登録モーダル */}
      <NewAlarmModal
        isNewAlarmModalOpen={isNewAlarmModalOpen}
        handleNewAlarmModalClose={handleNewAlarmModalClose}
        newAlarmData={newAlarmData}
        setNewAlarmData={setNewAlarmData} 
        handleNewAlarmChange={handleNewAlarmChange}
        handleNewAlarmSubmit={handleNewAlarmSubmit}
      />
    </div>
  );
}

export default AlarmList;
