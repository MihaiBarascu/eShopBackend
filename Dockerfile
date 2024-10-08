FROM node:20-alpine as development

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json .
COPY .env.development .

RUN npm install

COPY . .

RUN npm run build

FROM node:20-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json .
COPY .env.production .

RUN npm ci --only=production

COPY --from=development /usr/src/app/dist ./dist

CMD ["node","dist/index.js"]