// Sequelize からデータ型 (DataTypes) をインポート
// クエリを書かなくてもやり取りができるモジュール
// デフォルトで、updatedAt と createdAtのカラムがある
const { DataTypes } = require('sequelize');
// Sequelize インスタンスをインポートし、データベース接続を確立
const sequelize = require('../index');

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
  }
});

module.exports = Activity;
