// Sequelize からデータ型 (DataTypes) をインポート
const { DataTypes } = require('sequelize');
// Sequelize インスタンスをインポートし、データベース接続を確立
const sequelize = require('../index');

// アラームモデルの定義
const Alarm = sequelize.define('Alarm', {
  alarmName: {
    type: DataTypes.STRING,
    allowNull: false // アラーム名は必須
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true // アラームの説明は任意
  },
  windowName: {
    type: DataTypes.STRING,
    allowNull: false // 紐付けるウィンドウ名は必須
  },
  thresholdTime: {
    type: DataTypes.INTEGER,
    allowNull: false // 閾値となる時間は必須
  },
  isEnabled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true // デフォルトでアラームは有効（オン）にする
  }
});

// 'Alarm' モデルをエクスポートし、他のモジュールで使用できるようにします
module.exports = Alarm;
