FROM node:18-alpine AS builder
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

# # Next.js collects completely anonymous telemetry data about general usage.
# # Learn more here: https://nextjs.org/telemetry
# # Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

EXPOSE 3000

CMD ["pnpm", "start"]