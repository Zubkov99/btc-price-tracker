FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

#ARG HTTP_PORT=3000
#ENV PORT=$HTTP_PORT
EXPOSE 3000

CMD ["node", "dist/main.js"]
