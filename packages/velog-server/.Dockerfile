FROM node:18-alpine

WORKDIR /usr/src/app

COPY pacakage.json .

RUN npm install -g pnpm
RUN pnpm install

COPY . .

EXPOSE 5003

RUN ["pnpm", "prod"]