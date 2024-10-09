const { addAlarm, getAlarms, updateAlarm, deleteAlarm } = require('../resources/services/alam_CRUD'); // CRUD操作ファイルのパス
const sequelize = require('../resources/db'); // Sequelizeインスタンスのパス

(async () => {
  try {
    // データベース接続を確立
    await sequelize.authenticate();
    console.log('データベースに接続しました');

    // 新しいアラームを追加
    const result = await addAlarm({
      alarmName: 'Test Alarm',
      description: 'This is a test alarm',
      windowName: 'TestApp',
      thresholdTime: 3600, // 1時間のしきい値
      isEnabled: true
    });
    console.log(result);

    // すべてのアラームを取得して表示

    const id = "1";
    const alarms = await getAlarms();
    console.log('登録されたアラーム:', alarms);

    // アラームを更新
    const koushin = await updateAlarm(id,{ isEnabled: false });
    console.log(koushin)

    const sakujo = await deleteAlarm(id);
    console.log(sakujo)


    

  } catch (error) {
    console.error('エラーが発生しました:', error);
  } finally {
    // データベース接続を閉じる
    await sequelize.close();
    console.log('データベース接続を閉じました');
  }
})();
