# Password ZIP Text Tool

パスワード付きZIPファイル作成・解凍Webアプリケーション

## 概要

このアプリケーションは、テキストをパスワード付きZIPファイルに変換し、BASE64エンコードして出力する機能と、その逆変換を行う機能を提供します。

## 機能

- テキスト（最大1024文字）をパスワード付きZIPファイルに変換
- BASE64エンコードされた結果の出力
- BASE64データからのテキスト復元
- レスポンシブWebデザイン（スマートフォン対応）
- ブラウザ互換性チェック
- **完全クライアントサイド処理** - データはサーバに送信されません

## 技術スタック

- **フロントエンド**: React 18 + Bootstrap + React-Bootstrap
- **バックエンド**: Node.js + Express（静的ファイル配信）
- **ZIP処理**: JSZip（クライアントサイド）
- **テストツール**: Python 3
- **デプロイ**: サブディレクトリ `/password_zip_text/` 配下での動作対応

## 重要な注意事項

⚠️ **セキュリティ警告**: このツールはJSZipライブラリを使用しており、古い方式のZIP暗号化を使用しています。セキュリティ上の理由から、重要なデータには使用しないことを推奨します。

✅ **プライバシー保護**: 全ての処理はJavaScriptでクライアントサイド（ブラウザ内）で実行されるため、入力されたテキストやパスワードはサーバに送信されません。

## インストールと起動

### 1. 依存関係のインストール

```bash
# ルートディレクトリでサーバサイドの依存関係をインストール
npm install

# クライアントサイドの依存関係をインストール
cd client
npm install
```

### 2. 開発サーバーの起動

```bash
# ルートディレクトリから（サーバとクライアントを同時起動）
npm run dev
```

または個別に起動：

```bash
# サーバのみ起動（ポート9112）
npm run server

# クライアントのみ起動（別ターミナル）
npm run client
```

### 3. アクセス（開発環境）

- フロントエンド: <http://localhost:3000> （開発サーバー）
- バックエンド: <http://localhost:9112> （APIサーバー）

**注意**: 開発環境では `localhost:3000` でアクセスしますが、本番環境では `/password_zip_text/` サブディレクトリでの動作となります。

## 本番環境での起動

### 方法1: 自動スクリプト使用（推奨）

```bash
# 本番起動スクリプトを実行
bash start_production.sh
```

### 方法2: 手動実行

```bash
# 1. 依存関係のインストール
npm install
cd client && npm install && cd ..

# 2. Reactアプリのビルド
npm run build

# 3. 本番サーバ起動
npm start
```

### 方法3: ワンライナー

```bash
npm run prod
```

### 本番環境アクセス

- アプリケーション: <http://localhost:9112/password_zip_text/>

⚠️ **重要**: このアプリケーションはサブディレクトリ `/password_zip_text/` での動作を前提としています。
- 本番環境では `http://localhost:9112/password_zip_text/` でアクセスしてください
- 直接 `http://localhost:9112/` にアクセスすると404エラーになります

## Supervisorによるサービス管理

### 前提条件

- Supervisorのインストール
- nvm（Node Version Manager）でNode.jsを管理している場合の対応

### Supervisorのインストール

```bash
# Ubuntu/Debian
sudo apt install supervisor

# CentOS/RHEL
sudo yum install supervisor
```

### nvm対応について

このプロジェクトはnvmでNode.jsのバージョンを管理している環境に対応しています：

- `.nvmrc`ファイルで使用するNode.jsバージョンを指定
- `supervisor/start_with_nvm.sh`でnvm環境を初期化してからアプリケーション起動
- 複数のnvmインストールパス（`~/.nvm`, `/usr/local/nvm`, `/opt/nvm`）に対応

### ポータブル設定について

設定ファイルには環境固有の値をハードコードせず、プレースホルダーを使用：

- `supervisor/password-zip-text.conf` - テンプレートファイル（プレースホルダー使用）
- `supervisor/setup_supervisor.sh` - セットアップ時にプレースホルダーを実際の環境に置換
- **実行ユーザー自動調整**: `$(whoami)`で実行時のユーザーを自動検出
- **パス自動調整**: `$(pwd)`でプロジェクトパス、`~`でホームディレクトリを自動検出
- どの環境・どのユーザーでもgit cloneして`setup_supervisor.sh`を実行するだけで動作

#### 自動調整される項目

- `__PROJECT_DIR__` → 実際のプロジェクトディレクトリパス
- `__USER__` → セットアップ実行ユーザー名
- `__HOME_DIR__` → 実行ユーザーのホームディレクトリ
- `__NVM_DIR__` → 検出されたnvmディレクトリパス

### 初回セットアップ

```bash
# Supervisor設定の自動セットアップ
bash supervisor/setup_supervisor.sh

# 設定ファイルを配置（セットアップスクリプトの指示に従って実行）
sudo cp supervisor/password-zip-text.conf.updated /etc/supervisor/conf.d/password-zip-text.conf

# logrotate設定を配置
sudo cp supervisor/password-zip-text.logrotate /etc/logrotate.d/password-zip-text

# Supervisor設定を再読み込み
sudo supervisorctl reread
sudo supervisorctl update
```

### サービス管理（簡単な方法）

```bash
# サービス管理ヘルパースクリプト使用
bash supervisor/manage_service.sh start    # 開始
bash supervisor/manage_service.sh stop     # 停止
bash supervisor/manage_service.sh restart  # 再起動
bash supervisor/manage_service.sh status   # 状態確認
bash supervisor/manage_service.sh logs     # ログ確認
bash supervisor/manage_service.sh check    # Node.js/nvm環境確認
```

### サービス管理（直接コマンド）

```bash
# サービス開始
sudo supervisorctl start password-zip-text

# サービス停止
sudo supervisorctl stop password-zip-text

# サービス再起動
sudo supervisorctl restart password-zip-text

# サービス状態確認
sudo supervisorctl status password-zip-text

# ログ確認
sudo tail -f /var/log/supervisor/password-zip-text.log
```

## Pythonテストツール

ZIP解凍機能をテストするためのPythonスクリプトが含まれています。

### 使用方法

```bash
python test_extract.py <password> <base64_string>
```

### 例

```bash
python test_extract.py "testpass" "eyJwYXNzd29yZCI6ImRHVnpkSEJoYzNNPSJ9.UEsDBAoAAAAAAPCN...."
```

## プロジェクト構成

```text
password_zip_text/
├── server/                 # Node.jsサーバ
│   └── index.js
├── client/                 # Reactクライアント
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── utils/
│   │   └── App.js
│   └── package.json
├── supervisor/             # Supervisor設定
│   ├── password-zip-text.conf      # Supervisor設定ファイル
│   ├── password-zip-text.logrotate # ログローテーション設定
│   ├── start_with_nvm.sh           # nvm対応起動スクリプト
│   ├── setup_supervisor.sh         # 初回セットアップスクリプト
│   ├── manage_service.sh           # サービス管理スクリプト
│   └── check_node_version.sh       # Node.js/nvm環境確認スクリプト
├── .nvmrc                  # Node.jsバージョン指定ファイル
├── test_extract.py         # Pythonテストツール
├── run_test.sh            # テストスクリプト
├── start_production.sh    # 本番起動スクリプト
└── package.json
```

## 制限事項

- テキストサイズ: 最大1024文字
- パスワード長: 最大32文字
- 古いZIP暗号化方式の使用（セキュリティ制限あり）
- モダンブラウザでのみ動作

## ライセンス

MIT License
