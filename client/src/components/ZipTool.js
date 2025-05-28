import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Badge } from 'react-bootstrap';
import { create_password_zip_base64, extract_password_zip_base64 } from '../utils/zipUtils';
import { check_browser_compatibility } from '../utils/browserCompatibility';

const ZipTool = () => {
    const [inputText, setInputText] = useState('');
    const [password, setPassword] = useState('');
    const [zipResult, setZipResult] = useState('');
    const [base64Input, setBase64Input] = useState('');
    const [extractPassword, setExtractPassword] = useState('');
    const [extractResult, setExtractResult] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [compatibilityCheck, setCompatibilityCheck] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
        const compatibility = check_browser_compatibility();
        setCompatibilityCheck(compatibility);
    }, []);
    
    const handle_create_zip = async () => {
        setError('');
        setSuccess('');
        setIsLoading(true);
        
        try {
            const result = await create_password_zip_base64(inputText, password);
            setZipResult(result);
            setSuccess('パスワード付きZIPファイルが正常に作成されました');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handle_extract_zip = async () => {
        setError('');
        setSuccess('');
        setIsLoading(true);
        
        try {
            const result = await extract_password_zip_base64(base64Input, extractPassword);
            setExtractResult(result);
            setSuccess('ZIPファイルの解凍が正常に完了しました');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handle_copy_result = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            setSuccess('クリップボードにコピーしました');
        } catch (err) {
            setError('クリップボードへのコピーに失敗しました');
        }
    };
    
    const handle_clear_all = () => {
        setInputText('');
        setPassword('');
        setZipResult('');
        setBase64Input('');
        setExtractPassword('');
        setExtractResult('');
        setError('');
        setSuccess('');
    };
    
    if (!compatibilityCheck?.isCompatible) {
        return (
            <Container className="py-5">
                <Row className="justify-content-center">
                    <Col lg={8}>
                        <Card className="border-danger">
                            <Card.Header className="bg-danger text-white">
                                <h3 className="mb-0">
                                    <i className="bi bi-exclamation-triangle me-2"></i>
                                    ブラウザ互換性エラー
                                </h3>
                            </Card.Header>
                            <Card.Body>
                                <p className="mb-3">
                                    お使いのブラウザは以下の機能をサポートしていないため、このアプリケーションを使用できません：
                                </p>
                                <ul className="mb-3">
                                    {compatibilityCheck?.errors.map((error, index) => (
                                        <li key={index}>{error}</li>
                                    ))}
                                </ul>
                                <Alert variant="info" className="mb-0">
                                    モダンなブラウザ（Chrome、Firefox、Safari、Edge の最新版）をご利用ください。
                                </Alert>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }
    
    return (
        <Container className="py-4">
            <Row className="justify-content-center">
                <Col lg={10}>
                    {/* ヘッダー */}
                    <div className="text-center mb-5">
                        <h1 className="display-4 fw-bold text-primary mb-3">
                            <i className="bi bi-shield-lock me-3"></i>
                            Password ZIP Text Tool
                        </h1>
                        <p className="lead text-muted">
                            テキストをパスワード付きZIPファイルのBASE64テキストに変換・復元するツール
                        </p>
                    </div>
                    
                    {/* 注意事項 */}
                    <Row className="mb-4">
                        <Col>
                            <Alert variant="warning" className="border-0 shadow-sm">
                                <Alert.Heading className="h6">
                                    <i className="bi bi-exclamation-triangle me-2"></i>
                                    重要な注意事項
                                </Alert.Heading>
                                <p className="mb-2">
                                    このツールはJSZipライブラリを使用しており、古い方式のZIP暗号化を使用しています。
                                    セキュリティ上の理由から、重要なデータには使用しないことを推奨します。
                                </p>
                            </Alert>
                        </Col>
                    </Row>
                    
                    <Row className="mb-4">
                        <Col>
                            <Alert variant="success" className="border-0 shadow-sm">
                                <Alert.Heading className="h6">
                                    <i className="bi bi-shield-check me-2"></i>
                                    プライバシー保護
                                </Alert.Heading>
                                <p className="mb-0">
                                    全ての処理はJavaScriptでクライアントサイド（ブラウザ内）で実行されます。
                                    入力されたテキストやパスワードはサーバに送信されません。
                                </p>
                            </Alert>
                        </Col>
                    </Row>
                    
                    {/* エラー・成功メッセージ */}
                    {error && (
                        <Row className="mb-3">
                            <Col>
                                <Alert variant="danger" className="border-0 shadow-sm" dismissible onClose={() => setError('')}>
                                    <i className="bi bi-exclamation-circle me-2"></i>
                                    {error}
                                </Alert>
                            </Col>
                        </Row>
                    )}
                    
                    {success && (
                        <Row className="mb-3">
                            <Col>
                                <Alert variant="success" className="border-0 shadow-sm" dismissible onClose={() => setSuccess('')}>
                                    <i className="bi bi-check-circle me-2"></i>
                                    {success}
                                </Alert>
                            </Col>
                        </Row>
                    )}
                    
                    <Row>
                        {/* ZIP作成セクション */}
                        <Col lg={6} className="mb-4">
                            <Card className="h-100 border-0 shadow">
                                <Card.Header className="bg-primary text-white">
                                    <h4 className="mb-0">
                                        <i className="bi bi-file-zip me-2"></i>
                                        ZIP作成
                                    </h4>
                                </Card.Header>
                                <Card.Body>
                                    <Form>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-semibold">
                                                テキスト
                                                <Badge bg="secondary" className="ms-2">最大1024文字</Badge>
                                            </Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={4}
                                                value={inputText}
                                                onChange={(e) => setInputText(e.target.value)}
                                                placeholder="ZIPファイルに含めるテキストを入力してください"
                                                maxLength={1024}
                                                className="shadow-sm"
                                            />
                                            <Form.Text className="text-muted">
                                                {inputText.length}/1024 文字
                                            </Form.Text>
                                        </Form.Group>
                                        
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-semibold">
                                                パスワード
                                                <Badge bg="secondary" className="ms-2">最大32文字</Badge>
                                            </Form.Label>
                                            <Form.Control
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="パスワードを入力してください"
                                                maxLength={32}
                                                className="shadow-sm"
                                            />
                                            <Form.Text className="text-muted">
                                                {password.length}/32 文字
                                            </Form.Text>
                                        </Form.Group>
                                        
                                        <div className="d-grid">
                                            <Button
                                                variant="primary"
                                                size="lg"
                                                onClick={handle_create_zip}
                                                disabled={!inputText || !password || isLoading}
                                                className="shadow-sm"
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                        処理中...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="bi bi-file-zip me-2"></i>
                                                        ZIP作成
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                        
                                        {zipResult && (
                                            <div className="mt-3">
                                                <Form.Label className="fw-semibold">BASE64エンコード結果:</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={3}
                                                    value={zipResult}
                                                    readOnly
                                                    className="bg-light shadow-sm"
                                                />
                                                <div className="d-grid mt-2">
                                                    <Button
                                                        variant="outline-success"
                                                        onClick={() => handle_copy_result(zipResult)}
                                                        className="shadow-sm"
                                                    >
                                                        <i className="bi bi-clipboard me-2"></i>
                                                        結果をコピー
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                        
                        {/* ZIP解凍セクション */}
                        <Col lg={6} className="mb-4">
                            <Card className="h-100 border-0 shadow">
                                <Card.Header className="bg-success text-white">
                                    <h4 className="mb-0">
                                        <i className="bi bi-file-earmark-text me-2"></i>
                                        ZIP解凍
                                    </h4>
                                </Card.Header>
                                <Card.Body>
                                    <Form>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-semibold">BASE64エンコードされたZIPデータ:</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={4}
                                                value={base64Input}
                                                onChange={(e) => setBase64Input(e.target.value)}
                                                placeholder="BASE64エンコードされたZIPデータを入力してください"
                                                className="shadow-sm"
                                            />
                                        </Form.Group>
                                        
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-semibold">パスワード:</Form.Label>
                                            <Form.Control
                                                type="password"
                                                value={extractPassword}
                                                onChange={(e) => setExtractPassword(e.target.value)}
                                                placeholder="パスワードを入力してください"
                                                maxLength={32}
                                                className="shadow-sm"
                                            />
                                        </Form.Group>
                                        
                                        <div className="d-grid">
                                            <Button
                                                variant="success"
                                                size="lg"
                                                onClick={handle_extract_zip}
                                                disabled={!base64Input || !extractPassword || isLoading}
                                                className="shadow-sm"
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                        処理中...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="bi bi-unlock me-2"></i>
                                                        ZIP解凍
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                        
                                        {extractResult && (
                                            <div className="mt-3">
                                                <Form.Label className="fw-semibold">解凍結果:</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={3}
                                                    value={extractResult}
                                                    readOnly
                                                    className="bg-light shadow-sm"
                                                />
                                                <div className="d-grid mt-2">
                                                    <Button
                                                        variant="outline-success"
                                                        onClick={() => handle_copy_result(extractResult)}
                                                        className="shadow-sm"
                                                    >
                                                        <i className="bi bi-clipboard me-2"></i>
                                                        結果をコピー
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    
                    {/* クリアボタン */}
                    <Row>
                        <Col className="text-center">
                            <Button
                                variant="outline-secondary"
                                size="lg"
                                onClick={handle_clear_all}
                                className="shadow-sm"
                            >
                                <i className="bi bi-arrow-clockwise me-2"></i>
                                全クリア
                            </Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
};

export default ZipTool;