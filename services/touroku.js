const Sequelize = require('sequelize'); // Sequelizeをインポート
const Keyword = require('../db/models/Keyword'); 
const Activity = require('../db/models/Activity'); 
const { ipcMain } = require('electron');

// キーワードをデータベースに追加し、関連アクティビティを統合する関数を参照して実行
async function addKeyword(word) {
  try {
    // 既にキーワードが存在しないか確認
    const existingKeyword = await Keyword.findOne({ where: { word } });
    if (existingKeyword) {
      let message = "すでに登録されているキーワードです"
      return(message);
    }

    // キーワードをデータベースに追加
    await Keyword.create({ word });
    message = `${word}の追加しました`


    // キーワードに関連するアクティビティを統合
    await mergeActivitiesWithKeyword(word);
    return(message);
  } catch (error) {
    console.error('キーワード追加中にエラーが発生しました:', error);
  }
}

// 既存のキーワードに関連するアクティビティを統合する関数
async function mergeActivitiesWithKeyword(word) {
  try {
    // 新しいキーワードに関連するアクティビティを取得
    const activitiesWithKeyword = await Activity.findAll({
      where: {
        windowName: {
          [Sequelize.Op.like]: `%${word}%`  // キーワードを含むwindowNameを検索
        }
      }
    });

    if (activitiesWithKeyword.length === 0) {
      console.log('該当するアクティビティはありませんでした:', word);
      return;
    }

    // キーワードに関連するアクティビティがあった場合
    let totalActiveTime = 0;

    for (const activity of activitiesWithKeyword) {
      totalActiveTime += activity.activeTime;  // activeTimeを合計
      await activity.destroy();  // 元のアクティビティを削除
    }

    // キーワードに対応する新しいアクティビティを作成または更新
    let existingActivity = await Activity.findOne({ where: { windowName: word } });
    
    if (existingActivity) {
      // 既存のキーワード名のアクティビティにactiveTimeを追加
      existingActivity.activeTime += totalActiveTime;
      await existingActivity.save();
    } else {
      // 新しいアクティビティを作成
      await Activity.create({
        windowName: word,
        activeTime: totalActiveTime
      });
    }

    console.log('アクティビティの統合が完了しました:', word, '合計アクティブ時間:', totalActiveTime);
  } catch (error) {
    console.error('アクティビティ統合中にエラーが発生しました:', error);
  }
}



module.exports = addKeyword;
