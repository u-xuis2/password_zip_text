#!/bin/bash

umask 077

CUR_PATH=`pwd`
BIN_PATH=`dirname "${0}"`
BIN_NAME=`basename "${0}"`

set -uo pipefail

cd "${BIN_PATH}"

# テスト用のPythonスクリプト実行例
echo "=== パスワードZIP解凍テストツール ==="
echo ""
echo "使用方法:"
echo "  bash run_test.sh"
echo "  python test_extract.py <password> <base64_string>"
echo ""
echo "例:"
echo "  python test_extract.py 'testpass' 'eyJwYXNzd29yZCI6ImRHVnpkSEJoYzNNPSJ9.UEsDBAoAAAAAAPCN....'"
echo ""
echo "注意:"
echo "- パスワードは最大32文字"
echo "- BASE64文字列はWebアプリで生成されたもの"
echo "- JSZipライブラリの古い方式を使用しているため、セキュリティ上の制限があります"