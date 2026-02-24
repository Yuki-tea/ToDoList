# docker build -t my-api-standalone ./api でイメージをビルド
# docker run -p 3000:3000 my-api-standalone で起動

# 軽量なベースイメージを使用
FROM node:24-alpine

WORKDIR /app

# 依存関係の定義だけ先にコピー（キャッシュ効率化）
COPY package*.json ./
# Prismaスキーマもコピー（generateに必要）
COPY prisma ./prisma/

# 依存関係のインストール
RUN npm ci

# 全ソースコードをコピー
COPY . .

# Prismaクライアントの生成
RUN npx prisma generate

# ビルド（NestJSの場合）
RUN npm run build

# ポートの公開
EXPOSE 3000

# 実行コマンド
CMD ["npm", "run", "start:prod"]
