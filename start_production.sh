#!/bin/bash

umask 077

CUR_PATH=`pwd`
BIN_PATH=`dirname "${0}"`
BIN_NAME=`basename "${0}"`

set -uo pipefail

cd "${BIN_PATH}"

echo "=== Password ZIP Text Tool 本番起動スクリプト ==="
echo ""

# Node.jsバージョンチェック
echo "Node.jsバージョン確認中..."
node --version
echo ""

# 依存関係のインストール
echo "依存関係をインストール中..."
npm install

echo ""
echo "クライアントサイドの依存関係をインストール中..."
cd client
npm install
cd ..

echo ""
echo "Reactアプリケーションをビルド中..."
npm run build

echo ""
echo "本番サーバを起動中..."
echo "アクセスURL: http://localhost:9112"
echo "停止するには Ctrl+C を押してください"
echo ""

# 本番環境でサーバ起動
NODE_ENV=production node server/index.js