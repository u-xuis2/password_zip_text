#!/bin/bash

umask 077

CUR_PATH=`pwd`
BIN_PATH=`dirname "${0}"`
BIN_NAME=`basename "${0}"`

set -uo pipefail

cd "${BIN_PATH}"

SERVICE_NAME="password-zip-text"

show_usage() {
    echo "=== Password ZIP Text Tool サービス管理スクリプト ==="
    echo ""
    echo "使用方法: bash manage_service.sh <command>"
    echo ""
    echo "コマンド:"
    echo "  start     - サービスを開始"
    echo "  stop      - サービスを停止"
    echo "  restart   - サービスを再起動"
    echo "  status    - サービスの状態を確認"
    echo "  logs      - ログをリアルタイム表示"
    echo "  tail      - 最新のログを表示"
    echo "  setup     - 初回セットアップを実行"
    echo "  check     - Node.js/nvm環境を確認"
    echo ""
}

check_supervisor() {
    if ! command -v supervisorctl &> /dev/null; then
        echo "エラー: Supervisorがインストールされていません"
        echo ""
        echo "Ubuntu/Debian: sudo apt install supervisor"
        echo "CentOS/RHEL: sudo yum install supervisor"
        exit 101
    fi
}

case "${1:-}" in
    "start")
        echo "サービスを開始しています..."
        sudo supervisorctl start $SERVICE_NAME
        ;;
    "stop")
        echo "サービスを停止しています..."
        sudo supervisorctl stop $SERVICE_NAME
        ;;
    "restart")
        echo "サービスを再起動しています..."
        sudo supervisorctl restart $SERVICE_NAME
        ;;
    "status")
        echo "サービスの状態:"
        sudo supervisorctl status $SERVICE_NAME
        ;;
    "logs"|"tail")
        echo "最新のログ（Ctrl+Cで終了）:"
        sudo tail -f /var/log/supervisor/${SERVICE_NAME}.log
        ;;
    "setup")
        echo "初回セットアップを実行しています..."
        bash setup_supervisor.sh
        ;;
    "check")
        echo "Node.js/nvm環境を確認しています..."
        bash check_node_version.sh
        ;;
    *)
        show_usage
        ;;
esac