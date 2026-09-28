FROM node:20-bookworm-slim

WORKDIR /app

COPY package*.json ./
COPY bun.lock ./

RUN npm install

COPY . .

RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "server.js"]
