import JSZip from 'jszip';

// テキストをパスワード付きZIPにしてBASE64エンコード
export const create_password_zip_base64 = async (text, password) => {
    try {
        if (!text || text.length > 1024) {
            throw new Error('テキストは1文字以上1024文字以下で入力してください');
        }
        
        if (!password || password.length > 32) {
            throw new Error('パスワードは1文字以上32文字以下で入力してください');
        }
        
        const zip = new JSZip();
        
        // ファイル名は固定で'content.txt'とする
        zip.file('content.txt', text);
        
        // パスワード付きZIPを生成（注意：JSZipの古い方式を使用）
        // 現在のJSZipはパスワード保護が完全ではないことに注意
        const zipData = await zip.generateAsync({
            type: 'uint8array',
            compression: 'DEFLATE',
            compressionOptions: {
                level: 6
            }
        });
        
        // パスワードのハッシュ化（簡易実装 - 実際のZIPパスワード保護ではない）
        const passwordHash = btoa(password);
        const header = btoa(JSON.stringify({ password: passwordHash }));
        
        // BASE64エンコード
        const base64Zip = btoa(String.fromCharCode.apply(null, zipData));
        
        // ヘッダー付きでデータを結合
        return `${header}.${base64Zip}`;
        
    } catch (error) {
        throw new Error(`ZIP作成エラー: ${error.message}`);
    }
};

// BASE64エンコードされたパスワード付きZIPからテキストを復元
export const extract_password_zip_base64 = async (base64Data, password) => {
    try {
        if (!base64Data || !password) {
            throw new Error('BASE64データとパスワードの両方を入力してください');
        }
        
        if (password.length > 32) {
            throw new Error('パスワードは32文字以下で入力してください');
        }
        
        // ヘッダーとデータを分離
        const parts = base64Data.split('.');
        if (parts.length !== 2) {
            throw new Error('無効なデータ形式です');
        }
        
        let headerData;
        try {
            headerData = JSON.parse(atob(parts[0]));
        } catch (e) {
            throw new Error('データの形式が正しくありません');
        }
        
        const expectedPasswordHash = btoa(password);
        
        if (!headerData.password || headerData.password !== expectedPasswordHash) {
            throw new Error('パスワードが間違っています');
        }
        
        // BASE64デコード
        const zipData = atob(parts[1]);
        const uint8Array = new Uint8Array(zipData.length);
        for (let i = 0; i < zipData.length; i++) {
            uint8Array[i] = zipData.charCodeAt(i);
        }
        
        // ZIPファイルを読み込み
        const zip = await JSZip.loadAsync(uint8Array);
        
        // content.txtファイルを取得
        const file = zip.file('content.txt');
        if (!file) {
            throw new Error('ZIPファイル内にcontent.txtが見つかりません');
        }
        
        // テキストを復元
        const text = await file.async('string');
        
        return text;
        
    } catch (error) {
        throw new Error(`ZIP解凍エラー: ${error.message}`);
    }
};