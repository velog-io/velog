FROM node:18 as builder
WORKDIR /app
COPY package.json .
RUN npm install -g pnpm
RUN pnpm install

FROM node:18
RUN apk add --no-cache libc6-compat
RUN npm install -g pnpm
RUN mkdir -p /app
WORKDIR /app
COPY --from=builder /app/ /app/
COPY . .
RUN pnpm prisma generate

EXPOSE 5004

CMD ["pnpm", "prod"]