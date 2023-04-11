FROM node:18-alpine

WORKDIR /usr/src/middleware

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 8081

CMD ["node", "index.js"]