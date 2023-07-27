#syntax=docker/dockerfile:1.4
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json .

RUN npm install -g pnpm && pnpm i --frozen-lockfile


# # Next.js collects completely anonymous telemetry data about general usage.
# # Learn more here: https://nextjs.org/telemetry
# # Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

# RUN yarn build

# # If using npm comment out above and use below instead
RUN pnpm build

# # Production image, copy all the files and run next
# FROM base AS runner
# WORKDIR /app

# ENV NODE_ENV production
# # Uncomment the following line in case you want to disable telemetry during runtime.
# # ENV NEXT_TELEMETRY_DISABLED 1

# RUN \
#   addgroup --system --gid 1001 nodejs; \
#   adduser --system --uid 1001 nextjs

# COPY --from=builder --link /app/public ./public

# # Automatically leverage output traces to reduce image size
# # https://nextjs.org/docs/advanced-features/output-file-tracing
# COPY --from=builder --link --chown=1001:1001 /app/.next/standalone ./
# COPY --from=builder --link --chown=1001:1001 /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

# ENV PORT 3000
# ENV HOSTNAME localhost

# CMD ["node", "server.js"]