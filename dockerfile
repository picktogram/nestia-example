FROM node:16-alpine as prod

WORKDIR /usr/src/app

COPY ./package.json ./

ENV NODE_ENV=PRODUCTION

RUN npm install

COPY ./ ./

RUN npm run build

CMD ["node", "dist/main.js"]