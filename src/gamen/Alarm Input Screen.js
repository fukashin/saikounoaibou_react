import React, { useState } from 'react';
import '../CSS/AlarmInput.css';

function AlarmInput() {
  const [alarmData, setAlarmData] = useState({
    alarmName: '',
    description: '',
    windowName: '',
    thresholdTime: 0,
    isEnabled: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAlarmData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // アラーム追加リクエストを送信
    window.electron.ipcRenderer.send('add-alarm', alarmData);
  };

  return (
    <div className="alarm-input-container">
      <h2>アラームの登録</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="alarmName">アラーム名:</label>
          <input
            type="text"
            id="alarmName"
            name="alarmName"
            value={alarmData.alarmName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">説明:</label>
          <textarea
            id="description"
            name="description"
            value={alarmData.description}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="windowName">ウィンドウ名:</label>
          <input
            type="text"
            id="windowName"
            name="windowName"
            value={alarmData.windowName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="thresholdTime">閾値時間 (秒):</label>
          <input
            type="number"
            id="thresholdTime"
            name="thresholdTime"
            value={alarmData.thresholdTime}
            onChange={handleChange}
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
            checked={alarmData.isEnabled}
            onChange={handleChange}
          />
        </div>
        <button type="submit">登録</button>
      </form>
    </div>
  );
}

export default AlarmInput;