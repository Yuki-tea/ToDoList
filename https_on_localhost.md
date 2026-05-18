# ローカル開発環境のHTTPS化ガイド (Next.js & NestJS)

このドキュメントでは、Docker Compose環境でフロントエンド（Web）とバックエンド（API）をHTTPS化し、**SSL検証をスキップせずに**セキュアに通信させるための手順を解説します。

## 構成のゴール
*   **Web (Next.js):** `https://localhost:3001` で動作
*   **API (NestJS):** `https://localhost:3000` で動作
*   **コンテナ間通信:** Webから `https://api:3000` へSSL検証ありで通信
*   **セキュリティ:** コンテナを `root` 権限ではなく `node` ユーザーで実行

---

## 手順 1: ローカル認証局 (CA) と証明書の作成

### 1-1. 認証局 (CA) の作成
自分専用の「発行局」を作ります。

```bash
# 認証局の秘密鍵
openssl genrsa -out secrets/rootCA.key 2048

# 認証局の公開鍵（これを各OSに信頼させる）
openssl req -x509 -new -nodes -key secrets/rootCA.key -sha256 -days 1024 -out secrets/rootCA.pem \
  -subj "/C=JP/O=My Local Development/CN=My Local Root CA"
```

### 1-2. サーバー証明書用設定ファイルの作成
**重要:** コンテナ間通信（`https://api`）を通すために、SAN (Subject Alternative Name) に `api` を含める必要があります。

`secrets/localhost.ext` を作成：
```ini
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost
DNS.2 = api
IP.1 = 127.0.0.1
```

### 1-3. サーバー証明書の作成と署名
```bash
# 秘密鍵の作成
openssl genrsa -out secrets/localhost.key 2048

# 署名要求 (CSR) の作成
openssl req -new -key secrets/localhost.key -out secrets/localhost.csr -subj "/C=JP/O=Local Development/CN=localhost"

# 認証局による署名（SANを適用）
openssl x509 -req -in secrets/localhost.csr -CA secrets/rootCA.pem -CAkey secrets/rootCA.key \
  -CAcreateserial -out secrets/localhost.crt -days 365 -sha256 -extfile secrets/localhost.ext
```

---

## 手順 2: Webコンテナ (Next.js) の設定

### 2-1. Dockerfile.dev の修正
ビルド時にOSの証明書ストアにルートCAを登録します。

```dockerfile
USER root
RUN apk add --no-cache ca-certificates
# rootCA.pemをビルドコンテキストからコピーして登録
COPY rootCA.pem /usr/local/share/ca-certificates/rootCA.crt
RUN update-ca-certificates
USER node
```
※ビルド前に `cp secrets/rootCA.pem web/rootCA.pem` が必要です。

### 2-2. package.json の修正
起動スクリプトにHTTPSオプションを追加します。

```json
"scripts": {
  "dev": "next dev --experimental-https --experimental-https-key /app/secrets/localhost.key --experimental-https-cert /app/secrets/localhost.crt"
}
```

---

## 手順 3: APIコンテナ (NestJS) の設定

### 3-1. main.ts の修正
HTTPSオプションを読み込むように修正します。

```typescript
const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, '..', 'secrets', 'localhost.key')),
  cert: fs.readFileSync(path.join(__dirname, '..', 'secrets', 'localhost.crt')),
};
const app = await NestFactory.create(AppModule, { httpsOptions });
```

---

## 手順 4: Docker Compose の設定

最小限のファイルを読み取り専用 (`:ro`) でマウントし、Node.jsにシステムCAを使うよう指示します。

```yaml
services:
  api:
    volumes:
      - ./secrets/localhost.crt:/app/secrets/localhost.crt:ro
      - ./secrets/localhost.key:/app/secrets/localhost.key:ro

  web:
    environment:
      - API_INTERNAL_URL=https://api:3000
      - NODE_EXTRA_CA_CERTS=/app/secrets/rootCA.pem
      - NODE_OPTIONS=--use-system-ca
    volumes:
      - ./secrets/localhost.crt:/app/secrets/localhost.crt:ro
      - ./secrets/localhost.key:/app/secrets/localhost.key:ro
      - ./secrets/rootCA.pem:/app/secrets/rootCA.pem:ro
    command: npm run dev
```

---

## 詰まりやすいポイントと解決策

### ① `fetch failed` (Host: api is not in the cert's altnames)
*   **原因:** 証明書に `api` というホスト名が入っていない。
*   **解決:** 手順1-2の `.ext` ファイルで `DNS.2 = api` を追加して再発行する。

### ② `UNABLE_TO_VERIFY_LEAF_SIGNATURE`
*   **原因:** Node.jsがルートCAを信頼していない。
*   **解決:** 
    1. OSに `update-ca-certificates` で登録する。
    2. 環境変数 `NODE_OPTIONS=--use-system-ca` を設定してOSのストアを見に行くようにする。
    3. `NODE_EXTRA_CA_CERTS` で直接パスを指定する（Next.js/undici対策）。

### ③ `negative time stamp` エラー
*   **原因:** ホストとコンテナの時刻のズレ。SSL証明書は時刻に非常に厳格です。
*   **解決:** `docker-compose down` して再起動するか、WSL2の場合は `wsl --shutdown` を試す。

### ④ セキュリティ上の注意
*   **`rootCA.key` (秘密鍵) は絶対にコンテナにマウントしないこと。**
*   コンテナ内での `user: root` は避け、Dockerfile内で必要な時だけ `USER root` に切り替える。

---

## 手順 5: ブラウザの警告を消す (ホストマシンの設定)

ブラウザ（Chrome/Edge）の「この接続ではプライバシーが保護されません」という警告を消し、正常な鍵マーク（🔒）を表示させるには、ホストOSにルートCAを信頼させる必要があります。

### 5-1. Mac の場合
1.  `secrets/rootCA.pem` をダブルクリックして「キーチェーンアクセス」を開く。
2.  「ログイン」キーチェーンに `rootCA.pem` をドラッグ＆ドロップする。
3.  追加された `My Local Root CA` をダブルクリックし、「信頼」セクションを開く。
4.  **「この証明書を使用するとき」を「常に信頼」**に変更する。
5.  設定を保存（パスワード入力）し、**Chromeを再起動**する。

### 5-2. Windows の場合
1.  WSL2内のターミナルで、Windowsが認識しやすい拡張子のコピーを作成する:
    ```bash
    cp secrets/rootCA.pem secrets/rootCA.crt
    ```
2.  エクスプローラーで `\\wsl$\...` を開き、作成した `rootCA.crt` をダブルクリックする。
3.  「証明書のインストール」をクリックし、「現在のユーザー」を選択。
4.  **「証明書をすべて次のストアに配置する」** を選択し、「参照」をクリック。
5.  **「信頼されたルート証明機関」** を選択して「OK」をクリック。
6.  完了まで進み、セキュリティ警告で **「はい」** を選択する。
7.  **Chromeを再起動**する。

### 5-3. Firefox の場合 (独自ストア)
FirefoxはOSのストアを見ないため、個別に設定が必要です。
1.  設定 > プライバシーとセキュリティ > 証明書 > 証明書を表示。
2.  「認証局」タブで「インポート」をクリックし、`rootCA.pem` を選択。
3.  **「この認証局によるウェブサイトの識別を信頼する」** にチェックを入れて保存。

---

## 証明書の削除・信頼解除の方法

プロジェクトが終了した際や、設定をリセットしたい場合は、以下の手順で信頼を解除できます。

### Mac の場合
1.  「キーチェーンアクセス」を開き、検索欄で `My Local Root CA` を検索。
2.  対象の証明書を右クリックし、「"My Local Root CA"を削除」を選択。
3.  パスワードを入力して削除を完了する。

### Windows の場合
1.  スタートメニューで `certmgr.msc`（または「ユーザー証明書の管理」）と入力して実行。
2.  **「信頼されたルート証明機関」 > 「証明書」** を開く。
3.  一覧から `My Local Root CA` を探し、右クリックして「削除」を選択。

### Firefox の場合
1.  設定 > プライバシーとセキュリティ > 証明書 > 証明書を表示。
2.  「認証局」タブで `My Local Root CA` を探し、「削除または信頼を解除」をクリック。

---

## 運用と注意点

### 秘密鍵の管理
*   **`rootCA.key` (秘密鍵) は絶対にリポジトリに含めないでください。** 
*   自分専用のマスター鍵として、`~/.local/share/my-ca/` などの安全な場所で管理することを推奨します。

### 新しいプロジェクトでの利用
*   一度OSにルートCAを登録すれば、次からはそのCAで署名した新しい証明書（`.crt`）を作るだけで、最初からブラウザで信頼された状態になります。