const Keyword = require('../db/models/Keyword'); 
const Activity = require('../db/models/Activity'); 

// キーワードをデータベースから取得する関数
async function getKeywords() {
  try {
    // データベースからすべてのキーワードを取得
    const keywords = await Keyword.findAll();
    return keywords; // キーワードのリストを返す
  } catch (error) {
    console.error('Error fetching keywords:', error);
    throw error; // エラーが発生した場合、例外をスロー
  }
}

// アクティビティをデータベースから取得してフォーマットする関数
async function getActivity() {
  try {
    // データベースからすべてのアクティブを取得
    const activities = await Activity.findAll({
      order: [['updatedAt', 'DESC']]  // 更新日時でソート
    });

    // 取得したデータをフォーマット
    const formattedActivities = activities.map(activity => {
      return {
        ...activity.dataValues,
        activeTimeFormatted: formatTime(activity.activeTime)  // ミリ秒を整形して追加

      };
      
    });

    return formattedActivities;  // フォーマット済みのアクティビティリストを返す
  } catch (error) {
    console.error('Error fetching Activities:', error);
    throw error;  // エラーが発生した場合、例外をスロー
  }
}

// ミリ秒を "hh:mm:ss" 形式に整形する関数
function formatTime(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);  // ミリ秒を秒に変換
  const hours = Math.floor(totalSeconds / 3600);  // 時間を計算
  const minutes = Math.floor((totalSeconds % 3600) / 60);  // 分を計算

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}


// フォーマット関数をエクスポート
module.exports = { getKeywords, getActivity };
