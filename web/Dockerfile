# docker build -t my-web-standalone ./web でイメージをビルド
# docker run -p 3001:3000 my-web-standalone で起動

FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# ビルド（環境変数が必要な場合はビルド時に渡す設定にする）
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
