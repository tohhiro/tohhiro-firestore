# Tohhiro Firestore

Firebase Firestore の学習用プロジェクト

## 概要

Firestore の基本操作を学習

## 必要な環境

- Node.js v20 以上
- ブラウザ（Chrome、Firefox 等）

## セットアップ

1. リポジトリをクローン

```bash
git clone <repository-url>
cd tohhiro-firestore
```

2. Firebase 設定ファイルを作成

```bash
cp js/config.sample.js js/config.js
```

3. `js/config.js` に Firebase プロジェクトの設定情報を記入

## サーバーの起動

CORS の問題があるので、node.js や python などでローカルサーバを起動する必要があります。
ES6 モジュール（`type="module"`）を使用するため、HTTP サーバー経由でアクセスする必要があります。

### Node.js でサーバーを起動（推奨）

```bash
npx live-server --port=8000 --no-browser
```

ブラウザで `http://localhost:8000` にアクセスしてください。
ファイルを編集すると自動的にページがリロードされます。

### Python3 でサーバーを起動（代替方法）

```bash
python3 -m http.server 8000
```

ブラウザで `http://localhost:8000` にアクセスしてください。

## 使い方

1. サーバーを起動
2. ブラウザで `http://localhost:8000` を開く
3. デベロッパーツール（F12）のコンソールを確認
4. Firestore にデータが追加されたことを確認

## Firestore のデータ構造

- **Collection**: RDB のテーブルに相当（例: `messages`）
- **Document**: RDB のレコードに相当（例: 各メッセージ）
- ドキュメントの中にサブコレクションをネストできる階層構造

## トラブルシューティング

### CORS エラーが出る場合

ファイルを直接ブラウザで開いている（`file://`）場合、ES6 モジュールが動作しません。
必ず HTTP サーバー経由でアクセスしてください。

### ポートが使用中の場合

```bash
# ポート8000を使用中のプロセスを確認
lsof -i :8000

# プロセスを停止
kill -9 <PID>
```
