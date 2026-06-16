FROM node:24-slim

WORKDIR /app

COPY package.json ./
RUN npm install

COPY *.ts ./

ENV PORT=3100
EXPOSE 3100

CMD ["npx", "tsx", "http.ts"]
