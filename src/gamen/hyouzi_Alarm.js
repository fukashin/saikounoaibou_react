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
    thresholdTime: 0,
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
      thresholdTime: 0,
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

  const handleNewAlarmSubmit = (e) => {
    e.preventDefault();
    window.electron.ipcRenderer.send('add-alarm', newAlarmData);
    handleNewAlarmModalClose();
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

      <ul>
        {alarms.map((alarm, index) => (
          <li key={index} onClick={() => handleAlarmClick(alarm)}>
            <div>
              <strong>ウィンドウ名:</strong> {alarm.windowName}
            </div>
            <div>
              <strong>閾値時間:</strong> {alarm.thresholdTime} 分
            </div>
          </li>
        ))}
      </ul>

      {/* 新規アラーム登録モーダル */}
      <NewAlarmModal
        isNewAlarmModalOpen={isNewAlarmModalOpen}
        handleNewAlarmModalClose={handleNewAlarmModalClose}
        newAlarmData={newAlarmData}
        handleNewAlarmChange={handleNewAlarmChange}
        handleNewAlarmSubmit={handleNewAlarmSubmit}
      />
    </div>
  );
}

export default AlarmList;
