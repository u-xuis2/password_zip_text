// ブラウザ互換性チェック機能
export const check_browser_compatibility = () => {
    const errors = [];
    
    // JSZip必須機能チェック
    if (typeof ArrayBuffer === 'undefined') {
        errors.push('ArrayBufferがサポートされていません');
    }
    
    if (typeof Uint8Array === 'undefined') {
        errors.push('Uint8Arrayがサポートされていません');
    }
    
    if (typeof Blob === 'undefined') {
        errors.push('Blobがサポートされていません');
    }
    
    if (typeof FileReader === 'undefined') {
        errors.push('FileReaderがサポートされていません');
    }
    
    // Promise サポートチェック
    if (typeof Promise === 'undefined') {
        errors.push('Promiseがサポートされていません');
    }
    
    // 非同期関数サポートチェック（より安全な方法）
    try {
        // eval を使わずに関数コンストラクタで検証
        const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
        if (typeof AsyncFunction !== 'function') {
            throw new Error('async function constructor not available');
        }
    } catch (e) {
        errors.push('async/awaitがサポートされていません');
    }
    
    // ZIP処理に必要な最低限のWebAPIチェック
    if (!window.btoa || !window.atob) {
        errors.push('Base64エンコード/デコード機能がサポートされていません');
    }
    
    return {
        isCompatible: errors.length === 0,
        errors: errors
    };
};