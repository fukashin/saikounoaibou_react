import React from 'react';
import Modal from 'react-modal';
import  '../../CSS/ModalAnimations.css'

function NewAlarmModal({
  isNewAlarmModalOpen,
  handleNewAlarmModalClose,
  newAlarmData,
  handleNewAlarmChange,
  handleNewAlarmSubmit,
}) {
    return (
        <div className="modalContent">
          <Modal
            isOpen={isNewAlarmModalOpen}
            onRequestClose={handleNewAlarmModalClose}
            contentLabel="新規アラーム登録"
            className="modal"
            overlayClassName="modal-overlay"
          >
            <div className="alarmInputContainer">
              <h2>新規アラームの登録</h2>
              <form onSubmit={handleNewAlarmSubmit}>
                <div className="formGroup">
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
                <div className="formGroup">
                  <label htmlFor="description">説明:</label>
                  <textarea
                    id="description"
                    name="description"
                    value={newAlarmData.description}
                    onChange={handleNewAlarmChange}
                  />
                </div>
                <div className="formGroup">
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
                <div className="formGroup">
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
                <div className="formGroup">
                  <label htmlFor="isEnabled">アラームを有効にする:</label>
                  <input
                    type="checkbox"
                    id="isEnabled"
                    name="isEnabled"
                    checked={newAlarmData.isEnabled}
                    onChange={handleNewAlarmChange}
                  />
                </div>
                <button className="submitButton" type="submit">登録</button>
                <button className="cancelButton" type="button" onClick={handleNewAlarmModalClose}>
                  キャンセル
                </button>
              </form>
            </div>
          </Modal>
        </div>
      );
      
}

export default NewAlarmModal;
