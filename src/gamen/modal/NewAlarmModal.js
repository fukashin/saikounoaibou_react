import React from 'react';
import Modal from 'react-modal';
import '../../CSS/ModalAnimations.css';

function NewAlarmModal({
  isNewAlarmModalOpen, // モーダルが開いているかどうかを示すフラグ
  handleNewAlarmModalClose, // モーダルを閉じるための関数
  newAlarmData, // アラームデータを保持するオブジェクト
  setNewAlarmData, // 親コンポーネントから渡されたアラームデータを更新する関数
  handleNewAlarmChange, // 入力が変更された際に呼ばれる関数
  handleNewAlarmSubmit, // フォームが送信されたときに呼ばれる関数
}) {



  
  return (
    <Modal
      isOpen={isNewAlarmModalOpen} // モーダルが開いているかどうかを制御
      onRequestClose={handleNewAlarmModalClose} // モーダル外をクリックした場合にモーダルを閉じる
      contentLabel="新規アラーム登録" // アクセシビリティ用のラベル（スクリーンリーダーなど向け）
      className="modal" // モーダルのスタイルを指定
      overlayClassName="modal-overlay" // モーダル背景（オーバーレイ）のスタイルを指定
    >
      <div className="alarmInputContainer">
        <h2>新規アラームの登録</h2>
        <form onSubmit={handleNewAlarmSubmit}> {/* フォームが送信されたときに呼ばれる */}
          <div className="formGroup">
            <label htmlFor="alarmName">アラーム名:</label>
            <input
              type="text" // テキスト入力欄
              id="alarmName" // 入力欄のID（labelと関連付けるため）
              name="alarmName" // 入力欄の名前
              value={newAlarmData.alarmName} // 入力されているアラーム名の値
              onChange={handleNewAlarmChange} // 入力が変更されたときに呼ばれる
              required // このフィールドが必須であることを指定
            />
          </div>
          <div className="formGroup">
            <label htmlFor="description">説明:</label>
            <textarea
              id="description" // 説明欄のID
              name="description" // 説明欄の名前
              value={newAlarmData.description} // 説明の値
              onChange={handleNewAlarmChange} // 説明が変更されたときに呼ばれる
            />
          </div>
          <div className="formGroup">
            <label htmlFor="windowName">ウィンドウ名:</label>
            <input
              type="text" // テキスト入力欄
              id="windowName" // ウィンドウ名の入力欄ID
              name="windowName" // 入力欄の名前
              value={newAlarmData.windowName} // 入力されているウィンドウ名
              onChange={handleNewAlarmChange} // 入力が変更されたときに呼ばれる
              required // このフィールドが必須であることを指定
            />
          </div>

          {/* 時間と分を入力するセクション */}
          <label htmlFor="thresholdTimeHours">閾値時間:</label>
          <div>
            <input
              type="number" // 数値入力欄（時間）
              id="thresholdTimeHours" // 時間入力欄のID
              name="thresholdTimeHours" // 時間入力欄の名前
              value={newAlarmData.thresholdTimeHours || 0} // 入力されている時間（初期値0）
              onChange={(e) =>
                setNewAlarmData({
                  ...newAlarmData, // 既存のアラームデータを維持しつつ
                  thresholdTimeHours: e.target.value, // 時間を更新
                })
              }
              min="0" // 最小値を0に設定
              required // 必須フィールド
            />
            <label htmlFor="thresholdTimeHours">時間</label>

            <input
              type="number" // 数値入力欄（分）
              id="thresholdTimeMinutes" // 分入力欄のID
              name="thresholdTimeMinutes" // 分入力欄の名前
              value={newAlarmData.thresholdTimeMinutes || 0} // 入力されている分（初期値0）
              onChange={(e) =>
                setNewAlarmData({
                  ...newAlarmData, // 既存のアラームデータを維持しつつ
                  thresholdTimeMinutes: e.target.value, // 分を更新
                })
              }
              min="0" // 最小値を0に設定
              max="59" // 最大値を59に設定（分は0-59の範囲で入力）
              required // 必須フィールド
            />
            <label htmlFor="thresholdTimeMinutes">分</label>
          </div>

          {/* アラームを有効にするかどうかのチェックボックス */}
          <div className="formGroup">
            <label htmlFor="isEnabled">アラームを有効にする:</label>
            <input
              type="checkbox" // チェックボックス
              id="isEnabled" // チェックボックスのID
              name="isEnabled" // チェックボックスの名前
              checked={newAlarmData.isEnabled} // チェックボックスの状態（オン/オフ）
              onChange={handleNewAlarmChange} // チェック状態が変更されたときに呼ばれる
            />
          </div>

          {/* フォーム送信ボタン */}
          <button className="submitButton" type="submit">
            登録
          </button>

          {/* キャンセルボタン（モーダルを閉じる） */}
          <button
            className="cancelButton"
            type="button"
            onClick={handleNewAlarmModalClose} // キャンセルボタンが押されたときにモーダルを閉じる
          >
            キャンセル
          </button>
        </form>
      </div>
    </Modal>
  );
}

export default NewAlarmModal;
