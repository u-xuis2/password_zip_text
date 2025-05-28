#!/bin/bash

umask 077

CUR_PATH=`pwd`
BIN_PATH=`dirname "${0}"`
BIN_NAME=`basename "${0}"`

set -uo pipefail

cd "${BIN_PATH}/.."

echo "=== Password ZIP Text Tool Supervisor設定スクリプト ==="
echo ""

# 現在のユーザーとディレクトリを確認
CURRENT_USER=$(whoami)
CURRENT_DIR=$(pwd)
CURRENT_HOME=$(eval echo ~$CURRENT_USER)

echo "実行環境の検出結果:"
echo "  実行ユーザー: $CURRENT_USER"
echo "  ホームディレクトリ: $CURRENT_HOME"
echo "  プロジェクトディレクトリ: $CURRENT_DIR"
echo "  ユーザーID: $(id -u)"
echo "  グループID: $(id -g)"

# nvmの確認
echo ""
echo "nvm環境の確認..."

# 複数のnvmパスを確認
NVM_PATHS=(
    "$CURRENT_HOME/.nvm"
    "/usr/local/nvm"
    "/opt/nvm"
)

NVM_FOUND=false
DETECTED_NVM_DIR=""

for nvm_path in "${NVM_PATHS[@]}"; do
    if [ -s "$nvm_path/nvm.sh" ]; then
        export NVM_DIR="$nvm_path"
        source "$nvm_path/nvm.sh"
        echo "✅ nvm found at: $nvm_path"
        echo "Current Node.js version: $(node --version)"
        echo "Node.js path: $(which node)"
        DETECTED_NVM_DIR="$nvm_path"
        NVM_FOUND=true
        break
    fi
done

if [ "$NVM_FOUND" = false ]; then
    echo "⚠️  nvm not found - using system Node.js"
    echo "Current Node.js version: $(node --version 2>/dev/null || echo 'NOT FOUND')"
    DETECTED_NVM_DIR="$CURRENT_HOME/.nvm"
fi
echo ""

# .nvmrcファイルの確認と作成
if [ ! -f ".nvmrc" ]; then
    echo "Creating .nvmrc file with current Node.js version..."
    node --version > .nvmrc
    echo "Created .nvmrc: $(cat .nvmrc)"
else
    echo "Using existing .nvmrc: $(cat .nvmrc)"
fi

# Supervisor設定ファイルのプレースホルダーを置換
echo "Supervisor設定ファイルを更新中..."
cp supervisor/password-zip-text.conf /tmp/password-zip-text.conf.template

# プレースホルダーを実際の値に置換
sed "s|__PROJECT_DIR__|${CURRENT_DIR}|g" /tmp/password-zip-text.conf.template > /tmp/password-zip-text.conf.tmp1
sed "s|__USER__|${CURRENT_USER}|g" /tmp/password-zip-text.conf.tmp1 > /tmp/password-zip-text.conf.tmp2
sed "s|__HOME_DIR__|${CURRENT_HOME}|g" /tmp/password-zip-text.conf.tmp2 > /tmp/password-zip-text.conf.tmp3
sed "s|__NVM_DIR__|${DETECTED_NVM_DIR}|g" /tmp/password-zip-text.conf.tmp3 > supervisor/password-zip-text.conf.updated

# 一時ファイルの削除
rm -f /tmp/password-zip-text.conf.template /tmp/password-zip-text.conf.tmp1 /tmp/password-zip-text.conf.tmp2 /tmp/password-zip-text.conf.tmp3

echo "更新された設定ファイル:"
echo "  テンプレート: supervisor/password-zip-text.conf"
echo "  生成ファイル: supervisor/password-zip-text.conf.updated"
echo ""
echo "置換結果:"
echo "  __PROJECT_DIR__ → ${CURRENT_DIR}"
echo "  __USER__ → ${CURRENT_USER}"
echo "  __HOME_DIR__ → ${CURRENT_HOME}"
echo "  __NVM_DIR__ → ${DETECTED_NVM_DIR}"
echo ""
cat supervisor/password-zip-text.conf.updated
echo ""

# 依存関係のインストールとビルド
echo "依存関係のインストールとビルドを実行中..."
npm install
cd client && npm install && cd ..
npm run build

echo ""
echo "=== Supervisor設定手順 ==="
echo ""
echo "⚠️  重要: 設定ファイルは実行ユーザー '${CURRENT_USER}' で動作するように調整されています"
echo ""
echo "1. 設定ファイルを Supervisor の設定ディレクトリにコピー:"
echo "   sudo cp supervisor/password-zip-text.conf.updated /etc/supervisor/conf.d/password-zip-text.conf"
echo ""
echo "2. ログディレクトリの権限確認（必要に応じて）:"
echo "   sudo mkdir -p /var/log/supervisor"
echo "   sudo chown root:root /var/log/supervisor"
echo ""
echo "3. Supervisor の設定を再読み込み:"
echo "   sudo supervisorctl reread"
echo "   sudo supervisorctl update"
echo ""
echo "4. サービスの起動:"
echo "   sudo supervisorctl start password-zip-text"
echo ""
echo "5. サービスの状態確認:"
echo "   sudo supervisorctl status password-zip-text"
echo ""
echo "6. ログの確認:"
echo "   sudo tail -f /var/log/supervisor/password-zip-text.log"
echo ""
echo "=== 管理コマンド ==="
echo "起動: sudo supervisorctl start password-zip-text"
echo "停止: sudo supervisorctl stop password-zip-text"
echo "再起動: sudo supervisorctl restart password-zip-text"
echo "状態確認: sudo supervisorctl status password-zip-text"
echo ""
echo "=== 便利なヘルパースクリプト ==="
echo "bash supervisor/manage_service.sh start    # 開始"
echo "bash supervisor/manage_service.sh status   # 状態確認"
echo "bash supervisor/manage_service.sh logs     # ログ確認"