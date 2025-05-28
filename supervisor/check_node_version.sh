#!/bin/bash

umask 077

CUR_PATH=`pwd`
BIN_PATH=`dirname "${0}"`
BIN_NAME=`basename "${0}"`

set -uo pipefail

cd "${BIN_PATH}/.."

echo "=== Node.js環境確認スクリプト ==="
echo ""

# nvmの初期化（複数の標準パスに対応）
NVM_PATHS=(
    "$HOME/.nvm"
    "/usr/local/nvm"
    "/opt/nvm"
    "${NVM_DIR:-}"
)

NVM_FOUND=false
for nvm_path in "${NVM_PATHS[@]}"; do
    if [ -n "$nvm_path" ] && [ -s "$nvm_path/nvm.sh" ]; then
        export NVM_DIR="$nvm_path"
        source "$nvm_path/nvm.sh"
        echo "✅ nvm found at: $nvm_path"
        NVM_FOUND=true
        break
    fi
done

if [ "$NVM_FOUND" = false ]; then
    echo "⚠️  nvm not found - using system Node.js"
fi

echo ""
echo "Node.js environment:"
echo "  Version: $(node --version 2>/dev/null || echo 'NOT FOUND')"
echo "  Path: $(which node 2>/dev/null || echo 'NOT FOUND')"
echo "  npm Version: $(npm --version 2>/dev/null || echo 'NOT FOUND')"

if [ -f ".nvmrc" ]; then
    echo "  .nvmrc: $(cat .nvmrc)"
    if command -v nvm &> /dev/null; then
        echo "  Using nvm version from .nvmrc..."
        nvm use
    fi
else
    echo "  .nvmrc: NOT FOUND"
fi

echo ""
echo "Environment variables:"
echo "  HOME: $HOME"
echo "  NVM_DIR: ${NVM_DIR:-'NOT SET'}"
echo "  NODE_ENV: ${NODE_ENV:-'NOT SET'}"
echo "  PORT: ${PORT:-'NOT SET'}"