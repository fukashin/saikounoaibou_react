// Electronのアクティブなウィンドウ情報を取得するモジュールをインポート
const activeWindow = require('electron-active-window');
// データベースのActivityモデルをインポート
const Activity = require('../db/models/Activity');//モデルのインポートは｛｝付けない
const Keyword = require('../db/models/Keyword');


// 現在アクティブなウィンドウ名を保存する変数
let currentWindow = null;
// 最後にチェックした時間を記録する変数
let lastCheckTime = Date.now();

// アクティブウィンドウの監視を開始する関数
function startActiveWindowMonitoring() {
  // 1秒ごとに繰り返し処理を行う
  setInterval(async () => {
    // 現在の時間を取得
    const now = Date.now();
    // 前回のチェックからの経過時間を計算
    const deltaTime = now - lastCheckTime;
    // 最後のチェック時間を更新
    lastCheckTime = now;

    try {
      // アクティブなウィンドウ情報を取得
      const result = await activeWindow().getActiveWindow();
      // resultが空ではないか確認するif条件式
      if (result) {

        // アクティブなウィンドウの名前を取得、もし取得できなければ'Unknown'とする
        let windowName = result.windowName || 'Unknown';
        console.error(windowName);

        // ウィンドウ名を加工 (データベースのワードに基づいて)
        windowName = await extractWindowName(windowName);

        // 現在のウィンドウが前回のウィンドウと同じ場合
        if (currentWindow === windowName) {
          // データベースからウィンドウ名に基づいてアクティビティを検索
          const activity = await Activity.findOne({ where: { windowName } });
          if (activity) {
            // アクティビティが存在する場合、アクティブ時間を更新
            activity.activeTime += deltaTime;
            await activity.save();
          } else {
            // アクティビティが存在しない場合、新しく作成
            await Activity.create({ windowName, activeTime: deltaTime });
          }
        } else {
          // 新しいウィンドウに切り替わった場合
          currentWindow = windowName;
          const activity = await Activity.findOne({ where: { windowName } });
          if (!activity) {
            // アクティビティが存在しない場合、新しく作成
            await Activity.create({ windowName, activeTime: 0 });
          }
        }

        // アクティブウィンドウとアクティブ時間をコンソールに表示
        console.log(`Active window title: ${windowName}`);
        const activity = await Activity.findOne({ where: { windowName } });
        console.log(`Active time: ${activity.activeTime} ms`);
      } else {
        // アクティブなウィンドウが見つからない場合のメッセージ
        console.log('No active window found');
      }
    } catch (err) {
      // エラーが発生した場合のエラーメッセージ
      console.error('Error getting active window:', err);
    }
  }, 10000);
}

// ウィンドウ名を加工する関数
async function extractWindowName(windowName) {
  try {
    // データベースからすべてのキーワードを取得
    const keywords = await Keyword.findAll();

    // キーワードのリストをループして、ウィンドウ名にマッチするか確認
    for (const keyword of keywords) {
      if (windowName.includes(keyword.word)) {
        return keyword.word;
      }
    }

    // マッチするキーワードがない場合はそのまま返す
    return windowName;
  } catch (error) {
    console.error('Error extracting window name:', error);
    return windowName;  // エラーが発生した場合は元のウィンドウ名を返す
  }
}

// 関数をモジュールとしてエクスポート
module.exports = startActiveWindowMonitoring;
