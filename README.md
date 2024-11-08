### バージョン0.1
reactプロジェクト作成


### 現在のプロジェクト構成
ルートディレクトリ  
|  
|-- public　パッケージ化しても残る部分  
|   |-- electron.js　エントリーポイント  
|   |-- アイコン.png　閉じた後にトレイに入るアイコン  
|  
|-- resources　メイン処理のソースコード  
|   |-- db データベースの設定とモデル  
|     　|-- models データモデル  
|   |-- handlers reactとelectonの処理を仲介   
|   |-- services メインロジックデータベースへの処理などを記述  
|   |-- seeders データベースの初期値を設定する予定   
|  
|-- src reactのソースコード主にUIを作成
|   |-- CSS 見た目の装飾を作成  
|   |-- gamen UIをコンポーネントごとに作成  
|-- .gitignore gitで同期させないフォルダを指定  
|-- database.sqlite SQliteの本体データ  
|-- memo.txt  メモ  
|-- package-lock.json バージョンの固定設定を記載  
|-- package.json 依存関係の記載   
|-- README.md 説明書き今あなたが見ているこれ    

![タイトルなし](https://github.com/user-attachments/assets/99652c0f-d8a4-4bd0-bdfa-56e36244664b)
