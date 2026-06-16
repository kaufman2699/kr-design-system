FROM node:24-slim

WORKDIR /app

COPY package.json ./
RUN npm install --production

COPY *.ts ./

ENV PORT=3100
EXPOSE 3100

CMD ["node", "--experimental-strip-types", "http.ts"]
