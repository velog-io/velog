FROM node:18-alpine

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json .

RUN npm install -g pnpm
RUN pnpm install

COPY . .

RUN npx prisma generate

EXPOSE 5003

CMD ["pnpm", "prod"]