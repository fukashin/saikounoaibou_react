const Keyword = require('../db/models/Keyword'); 
const Activity = require('../db/models/Activity'); 

// キーワードをデータベースから取得する関数
async function getKeywords() {
  try {
    // データベースからすべてのキーワードを取得
    const keywords = await Keyword.findAll();
    //取得したデータの中身を確認
    //  console.log('Fetched keywords:', keywords);
    return keywords; // キーワードのリストを返す
  } catch (error) {
    console.error('Error fetching keywords:', error);
    throw error; // エラーが発生した場合、例外をスロー
  }
}


async function getActivity() {
    try {
      // データベースからすべてのアクティブを取得
      const Activitys = await Activity.findAll({
        order:[['updatedAt' , 'DESC']]
      });
      return Activitys; // アクティブのリストを返す
    } catch (error) {
      console.error('Error fetching Activitys:', error);
      throw error; // エラーが発生した場合、例外をスロー
    }
  }

module.exports = {getKeywords,getActivity};
