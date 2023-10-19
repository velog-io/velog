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

COPY /scripts/entrypoint.sh /scripts/entrypoint.sh
RUN chmod +x /scripts/entrypoint.sh

RUN pnpm prisma generate
RUN pnpm build

ARG DOCKER_ENV
ENV NODE_ENV=${DOCKER_ENV}
EXPOSE 5003

CMD ["/scripts/entrypoint.sh"]