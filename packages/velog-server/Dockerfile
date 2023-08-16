FROM node:18-alpine

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json .

RUN npm install -g pnpm
RUN pnpm install


RUN pnpm prisma:copy
COPY . .
RUN pnpm prisma:rm

RUN pnpm prisma generate

EXPOSE 5003

CMD ["pnpm", "prod"]