const Alarm = require('../db/models/Alarm'); 
const { ipcMain } = require('electron');

// アラームをデータベースに追加する
async function addAlarm(alarmData) {
  try {
    // 既にアラームが存在しないか確認
    const existingAlarm = await Alarm.findOne({ where: { alarmName: alarmData.alarmName } });
    if (existingAlarm) {
      return "すでに登録されているアラームです";
    }

    // アラームをデータベースに追加
    await Alarm.create(alarmData);
    return `${alarmData.alarmName}のアラームを追加しました`;
  } catch (error) {
    console.error('アラーム追加中にエラーが発生しました:', error);
    throw new Error('アラームの追加に失敗しました');
  }
}

// アラームをすべて取得する
async function getAlarms() {
  try {
    const alarms = await Alarm.findAll();
    return alarms;
  } catch (error) {
    console.error('アラーム取得中にエラーが発生しました:', error);
    throw new Error('アラームの取得に失敗しました');
  }
}

// アラームを更新する
async function updateAlarm(id, updatedData) {
  try {
    const alarm = await Alarm.findByPk(id);
    if (!alarm) {
      return "アラームが見つかりません";
    }

    await alarm.update(updatedData);
    return `${alarm.alarmName}のアラームを更新しました`;
  } catch (error) {
    console.error('アラーム更新中にエラーが発生しました:', error);
    throw new Error('アラームの更新に失敗しました');
  }
}

// アラームを削除する
async function deleteAlarm(id) {
  try {
    const alarm = await Alarm.findByPk(id);
    if (!alarm) {
      return "アラームが見つかりません";
    }

    await alarm.destroy();
    return `${alarm.alarmName}のアラームを削除しました`;
  } catch (error) {
    console.error('アラーム削除中にエラーが発生しました:', error);
    throw new Error('アラームの削除に失敗しました');
  }
}

module.exports = {
  addAlarm,
  getAlarms,
  updateAlarm,
  deleteAlarm
};
