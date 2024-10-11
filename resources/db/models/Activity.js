// Sequelize からデータ型 (DataTypes) をインポート
// クエリを書かなくてもやり取りができるモジュール
// デフォルトで、updatedAt と createdAtのカラムがある
const { DataTypes } = require('sequelize');
// Sequelize インスタンスをインポートし、データベース接続を確立
const sequelize = require('../index');

const moment = require('moment'); // 日付の操作のために moment.js を使用

// 'Activity' モデルを定義
// このモデルは、データベース内の 'Activity' テーブルに対応し、ウィンドウのアクティブ時間を保存します
// 変数sequelizeに入っているのはindexの方でインスタンス化しているsequelize
// sequelizeでデフォルトで入っているメソッドは多い
const Activity = sequelize.define('Activity', {
  // 'windowName' フィールドを定義
  // これはアクティブなウィンドウの名前（タイトル）を保存するためのフィールドです
  windowName: {
    // データ型は文字列 (STRING) で、null を許可しません
    type: DataTypes.STRING,
    allowNull: false
  },
  // 'activeTime' フィールドを定義
  // これはウィンドウがアクティブだった時間（ミリ秒）を保存するためのフィールドです
  activeTime: {
    // データ型は整数 (INTEGER) で、null を許可しません
    type: DataTypes.INTEGER,
    allowNull: false,
    // デフォルト値は 0 に設定されています
    defaultValue: 0
  },
  month: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  week: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  day: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
},
{
  hooks: {
    beforeCreate: (activity, options) => {
      const now = moment().tz("Asia/Tokyo"); // 現在の時刻を JST に設定
      activity.month = now.month() + 1; // 月 (0 から始まるため +1)
      activity.week = now.week(); // 年の週番号
      activity.day = now.date(); // 日付
    },
    beforeUpdate: (activity, options) => {
      const now = moment().tz("Asia/Tokyo"); // 現在の時刻を JST に設定
      activity.month = now.month() + 1; // 月 (0 から始まるため +1)
      activity.week = now.week(); // 年の週番号
      activity.day = now.date(); // 日付
    }
  }
});

module.exports = Activity;
