// dbから Keyword モデルをインポート
// const { Keyword } = require('../db/models/Keyword');という構文では、Keywordがundefinedになってしまうことがあります。
// 通常、モデルはデフォルトエクスポートされているため、require文で直接インポートする必要があります。

// このファイルは　main.jsで呼び出す必要がある
// main.js
// const setupIpcHandlers = require('./services/handlers')
// setupIpcHandlers();

// Electronのメインプロセスで使用するIPC（プロセス間通信）をインポート
const { ipcMain } = require('electron');

// キーワードを追加するための関数を外部ファイルからインポート
const addKeyword = require('../services/touroku');

// レコードを削除するための関数を外部ファイルからインポート
const { deleteRecordById, deleteAllRecords ,deleteAllkeywordRecords,deleteRecordById_Keyword} = require('../services/sakujo');

// レコードを取得するための関数を外部ファイルからインポート
const {getKeywords,getActivity,getMonthlyData, getWeeklyData, getDailyData} = require('../services/syutoku')

// アラーム関連処理
const { addAlarm, getAlarms, updateAlarm, deleteAlarm } = require('../services/alam_CRUD');

// IPCハンドラーを設定する関数
function setupIpcHandlers() {

    // キーワード追加のIPCリスナー
    // レンダラープロセスから 'add-keyword' イベントが送信された時に実行される
    
    // キーワード追加のIPCリスナー
    ipcMain.on('add-keyword', async (event, keyword) => {
        try {
            // キーワードを追加する関数を呼び出し、結果を取得
            const result = await addKeyword(keyword);
    
            // すでに登録されている場合も含めて結果を処理
            if (result === "すでに登録されているキーワードです") {
                // キーワードが既に存在する場合のメッセージを送信
                event.reply('add-error', result);
            } else {
                // 成功した場合のメッセージを送信
                event.reply('add-success', result);
            }
        } catch (error) {
            // 失敗した場合のエラーメッセージを送信
            event.reply('add-error', `キーワードの追加に失敗しました: ${error.message}`);
        }
    });
    

    // アクティビティー削除のIPCハンドラー
    // レンダラープロセスから 'delete-record' イベントが送信された時に実行される
    ipcMain.on('delete-Activity', async (event, id) => {
        try {
            // 指定されたIDのレコードを削除する関数を呼び出し
            await deleteRecordById(id);
            // 成功した場合、レンダラープロセスに結果を返信　replyはほぼsendと同じ扱いらしい
            event.reply('delete-success', `Record with id ${id} was deleted.`);
        } catch (error) {
            // 失敗した場合、エラーメッセージをレンダラープロセスに返信
            event.reply('delete-error', `Failed to delete record: ${error.message}`);
        }
    });

    // レンダラープロセスから 'delete-record' イベントが送信された時に実行される
    ipcMain.on('delete-Keyword', async (event, id) => {
        try {
            // 指定されたIDのレコードを削除する関数を呼び出し
            await deleteRecordById_Keyword(id);
            // 成功した場合、レンダラープロセスに結果を返信　replyはほぼsendと同じ扱いらしい
            event.reply('delete-success', `Record with id ${id} was deleted.`);
        } catch (error) {
            // 失敗した場合、エラーメッセージをレンダラープロセスに返信
            event.reply('delete-error', `Failed to delete record: ${error.message}`);
        }
    });

    // 全アクティブレコード削除のIPCハンドラー
    // レンダラープロセスから 'delete-all-records' イベントが送信された時に実行される
    ipcMain.on('delete-all-records', async (event) => {
        try {
            // すべてのレコードを削除する関数を呼び出し
            await deleteAllRecords();
            // 成功した場合、レンダラープロセスに結果を返信
            event.reply('delete-success', 'All records were deleted.');
        } catch (error) {
            // 失敗した場合、エラーメッセージをレンダラープロセスに返信
            event.reply('delete-error', `Failed to delete all records: ${error.message}`);
        }
    });

        // レンダラープロセスから 'delete-all-keyword-records' イベントが送信された時に実行される
        ipcMain.on('delete-all-keyword-records', async (event) => {
          try {
              // すべてのレコードを削除する関数を呼び出し
              await deleteAllkeywordRecords();
              // 成功した場合、レンダラープロセスに結果を返信
              event.reply('delete-success', 'All records were deleted.');
          } catch (error) {
              // 失敗した場合、エラーメッセージをレンダラープロセスに返信
              event.reply('delete-error', `Failed to delete all records: ${error.message}`);
          }
      });

    //   IPCハンドラーを設定
    ipcMain.on('get-keywords', async (event) => {
        try {
            const keywords = await getKeywords(); // キーワードを取得
            console.log('Received dataaaaaaaaaaaaaa:', JSON.stringify(keywords)); // デバッグ用にシリアライズされたデータを表示
            event.reply('keywords-list', JSON.parse(JSON.stringify(keywords))); // キーワードリストをレンダラープロセスに送信
        } catch (error) {
    event.reply('keywords-error', 'Failed to fetch keywords'); // エラーを送信
    }
  });


  // IPCハンドラーを設定
    ipcMain.on('get-Activity', async (event) => {
        try {
            const Activity = await getActivity(); // キーワードを取得
            console.log('Received zentai:', JSON.stringify(Activity)); // デバッグ用にシリアライズされたデータを表示
            event.reply('Activity-list', JSON.parse(JSON.stringify(Activity))); // キーワードリストをレンダラープロセスに送信
        } catch (error) {
    event.reply('Activity-error', 'Failed to fetch Activity'); // エラーを送信
}
});

// 日ごとのデータを取得
ipcMain.on('get-Activity_day', async (event,day) => {
    try {
        console.log(`temaemade${day}`);
        const Activity = await getDailyData(day); // データを取得
        console.log('Received day:', JSON.stringify(Activity)); // デバッグ用にシリアライズされたデータを表示
        event.reply('Activity-list', JSON.parse(JSON.stringify(Activity))); // キーワードリストをレンダラープロセスに送信
    } catch (error) {
        console.error('Error occurred while fetching daily data:', error); // エラーメッセージを詳細に表示
        event.reply('Activity-error', 'Failed to fetch Activity'); // エラーを送信
    }
});
// 週ごとのデータを取得
ipcMain.on('get-Activity_week', async (event,week) => {
    try {
        console.log(`aaaaaa${week}`)
        const Activity = await getWeeklyData(week); //  データを取得
        console.log('Received dataaaaaaaaaaaaaa:', JSON.stringify(Activity)); // デバッグ用にシリアライズされたデータを表示
        event.reply('Activity-list', JSON.parse(JSON.stringify(Activity))); // キーワードリストをレンダラープロセスに送信
    } catch (error) {
event.reply('Activity-error', 'Failed to fetch Activity'); // エラーを送信
}
});
// 月ごとのデータを取得
ipcMain.on('get-Activity_month', async (event,month) => {
    try {
        const Activity = await getMonthlyData(month); //  データを取得
        console.log('Received dataaaaaaaaaaaaaa:', JSON.stringify(Activity)); // デバッグ用にシリアライズされたデータを表示
        event.reply('Activity-list', JSON.parse(JSON.stringify(Activity))); // キーワードリストをレンダラープロセスに送信
    } catch (error) {
event.reply('Activity-error', 'Failed to fetch Activity'); // エラーを送信
}
});

ipcMain.on('add-alarm', async (event,alarmData) => {
    try {
        // キーワードを追加する関数を呼び出し、結果を取得
        const result = await addAlarm(alarmData);

        // すでに登録されている場合も含めて結果を処理
        if (result === "すでに登録されているアラームです") {
            // キーワードが既に存在する場合のメッセージを送信
            event.reply('add-error', result);
        } else {
            // 成功した場合のメッセージを送信
            event.reply('add-success', result);
        }
    } catch (error) {
        // 失敗した場合のエラーメッセージを送信
        event.reply('add-error', `アラームの追加に失敗しました: ${error.message}`);
    }
});

}


// 他のファイルからこの関数を呼び出せるようにエクスポート
module.exports = setupIpcHandlers;