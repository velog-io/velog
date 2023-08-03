FROM node:18-alpine

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json .

RUN npm install -g pnpm
RUN pnpm install

RUN npm install -g dotenv-cli

COPY . .

RUN pnpm prisma generate

EXPOSE 5003

CMD ["pnpm", "prod"]