FROM node:18-alpine

WORKDIR /usr/src/app

COPY package.json .

RUN npm install -g pnpm
RUN pnpm install

RUN npm install -g dotenv-cli

COPY . .

RUN pnpm prisma generate

EXPOSE 5003

CMD ["pnpm", "prod"]