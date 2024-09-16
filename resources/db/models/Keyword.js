// Sequelize からデータ型 (DataTypes) をインポート
// クエリを書かなくてもやり取りができるモジュール
// デフォルトで、updatedAt と createdAtのカラムがある
const { DataTypes } = require('sequelize');
// Sequelize インスタンスをインポートし、データベース接続を確立
const sequelize = require('../index');


// 検索用キーワードモデル
const Keyword = sequelize.define('Keyword', {
    word: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true // ワードが重複しないようにする
    }
  });
  
  // 'Activity' モデルをエクスポートし、他のモジュールで使用できるようにします
  module.exports = Keyword;