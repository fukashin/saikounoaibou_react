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
const { deleteRecordById, deleteAllRecords ,deleteAllkeywordRecords} = require('../services/sakujo');

// レコードを取得するための関数を外部ファイルからインポート
const {getKeywords,getActivity} = require('../services/syutoku')

// IPCハンドラーを設定する関数
function setupIpcHandlers() {

    // キーワード追加のIPCリスナー
    // レンダラープロセスから 'add-keyword' イベントが送信された時に実行される
    ipcMain.on('add-keyword', async (event, keyword) => {
        try {
            // キーワードを追加する関数を呼び出し
            await addKeyword(keyword);
            // 成功した場合、レンダラープロセスに結果を返信
            event.reply('keyword-added', `Keyword "${keyword}" added successfully!`);
        } catch (error) {
            // 失敗した場合、エラーメッセージをレンダラープロセスに返信
            event.reply('keyword-added', `Failed to add keyword: ${error.message}`);
        }
    });

    // レコード削除のIPCハンドラー
    // レンダラープロセスから 'delete-record' イベントが送信された時に実行される
    ipcMain.on('delete-record', async (event, id) => {
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
            console.log('Received dataaaaaaaaaaaaaa:', JSON.stringify(Activity)); // デバッグ用にシリアライズされたデータを表示
            event.reply('Activity-list', JSON.parse(JSON.stringify(Activity))); // キーワードリストをレンダラープロセスに送信
        } catch (error) {
    event.reply('Activity-error', 'Failed to fetch Activity'); // エラーを送信
}
});
}


// 他のファイルからこの関数を呼び出せるようにエクスポート
module.exports = setupIpcHandlers;