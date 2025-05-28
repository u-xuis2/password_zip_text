#!/bin/bash

umask 077

CUR_PATH=`pwd`
BIN_PATH=`dirname "${0}"`
BIN_NAME=`basename "${0}"`

set -uo pipefail

cd "${BIN_PATH}/.."

# nvmの初期化（複数の標準パスに対応）
NVM_PATHS=(
    "$HOME/.nvm"
    "/usr/local/nvm"
    "/opt/nvm"
    "${NVM_DIR:-}"
)

for nvm_path in "${NVM_PATHS[@]}"; do
    if [ -n "$nvm_path" ] && [ -s "$nvm_path/nvm.sh" ]; then
        export NVM_DIR="$nvm_path"
        source "$nvm_path/nvm.sh"
        echo "nvm loaded from: $nvm_path"
        break
    fi
done

if [ -z "${NVM_DIR:-}" ]; then
    echo "Warning: nvm not found - using system Node.js"
fi

# .nvmrcファイルがある場合はそのバージョンを使用
if [ -f ".nvmrc" ]; then
    echo "Using Node.js version from .nvmrc"
    nvm use
else
    echo "Using current Node.js version"
fi

# Node.jsのバージョンとパスを確認
echo "Node.js version: $(node --version)"
echo "Node.js path: $(which node)"
echo "npm version: $(npm --version)"

# 環境変数の設定
export NODE_ENV=production
export PORT=9112

# アプリケーションの起動
exec node server/index.js