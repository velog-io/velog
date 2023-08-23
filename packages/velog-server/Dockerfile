FROM node:18-alpine as builder
WORKDIR /app
COPY package.json .
RUN npm install -g pnpm
RUN pnpm install

FROM node:18-alpine
RUN apk add --no-cache libc6-compat
RUN npm install -g pnpm
RUN mkdir -p /app
WORKDIR /app
COPY --from=builder /app/ /app/
COPY . .
RUN pnpm prisma generate

EXPOSE 5003

CMD ["pnpm", "prod"]