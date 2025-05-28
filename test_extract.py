#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
パスワード付きZIPファイル解凍テストツール

使用方法:
    python test_extract.py <password> <base64_string>

引数:
    password: パスワード文字列
    base64_string: BASE64エンコードされたZIPデータ
"""

import sys
import base64
import json
import zipfile
import io
import traceback

def extract_password_zip_base64(base64_data, password):
    """
    BASE64エンコードされたパスワード付きZIPからテキストを復元
    """
    try:
        if not base64_data or not password:
            raise ValueError('BASE64データとパスワードの両方を入力してください')
        
        if len(password) > 32:
            raise ValueError('パスワードは32文字以下で入力してください')
        
        # ヘッダーとデータを分離
        parts = base64_data.split('.')
        if len(parts) != 2:
            raise ValueError('無効なデータ形式です')
        
        # ヘッダーの検証
        try:
            header_data = json.loads(base64.b64decode(parts[0]).decode('utf-8'))
        except Exception as e:
            raise ValueError(f'ヘッダーの解析に失敗しました: {repr(e)}')
        
        expected_password_hash = base64.b64encode(password.encode('utf-8')).decode('utf-8')
        
        if not header_data.get('password') or header_data.get('password') != expected_password_hash:
            raise ValueError('パスワードが間違っています')
        
        # BASE64デコード
        try:
            zip_data = base64.b64decode(parts[1])
        except Exception as e:
            raise ValueError(f'BASE64デコードに失敗しました: {repr(e)}')
        
        # ZIPファイルを読み込み
        try:
            with zipfile.ZipFile(io.BytesIO(zip_data), 'r') as zip_file:
                # content.txtファイルを取得
                if 'content.txt' not in zip_file.namelist():
                    raise ValueError('ZIPファイル内にcontent.txtが見つかりません')
                
                # テキストを復元
                with zip_file.open('content.txt') as file:
                    text = file.read().decode('utf-8')
                
                return text
        except zipfile.BadZipFile as e:
            raise ValueError(f'無効なZIPファイルです: {repr(e)}')
        except Exception as e:
            raise ValueError(f'ZIPファイルの読み込みに失敗しました: {repr(e)}')
        
    except Exception as e:
        raise Exception(f'ZIP解凍エラー: {repr(e)}')

def main():
    """
    メイン処理
    """
    if len(sys.argv) != 3:
        print('使用方法: python test_extract.py <password> <base64_string>', file=sys.stderr, flush=True)
        print('', file=sys.stderr, flush=True)
        print('引数:', file=sys.stderr, flush=True)
        print('  password: パスワード文字列（最大32文字）', file=sys.stderr, flush=True)
        print('  base64_string: BASE64エンコードされたZIPデータ', file=sys.stderr, flush=True)
        sys.exit(101)
    
    password = sys.argv[1]
    base64_string = sys.argv[2]
    
    try:
        # 解凍処理を実行
        result = extract_password_zip_base64(base64_string, password)
        
        # 結果を標準出力に出力（正常系）
        print(result, flush=True)
        
    except Exception as e:
        # エラーメッセージを標準エラー出力に出力
        print(f'エラー: {repr(e)}', file=sys.stderr, flush=True)
        print('', file=sys.stderr, flush=True)
        print('スタックトレース:', file=sys.stderr, flush=True)
        traceback.print_exc(file=sys.stderr)
        sys.exit(102)

if __name__ == '__main__':
    main()