const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const app = express();
const PORT = 9112;

// セキュリティミドルウェア
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'", "https://cdn.jsdelivr.net"]
        }
    }
}));

// CORS設定
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? false : 'http://localhost:3000',
    credentials: true
}));

// JSONパーサー設定（最大1MB）
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// 静的ファイル配信（本番環境用）
// アプリケーションは /password_zip_text/ サブディレクトリで動作
if (process.env.NODE_ENV === 'production') {
    app.use('/password_zip_text', express.static(path.join(__dirname, '../client/build')));
    
    // SPAのルーティング対応：/password_zip_text/ 配下の全てのリクエストをindex.htmlに転送
    app.get('/password_zip_text/*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/build/index.html'));
    });
}

// ヘルスチェックエンドポイント
// /password_zip_text/api/health でアプリケーションの動作確認が可能
app.get('/password_zip_text/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// エラーハンドリングミドルウェア
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ 
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'サーバーエラーが発生しました'
    });
});

// 404ハンドリング
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;