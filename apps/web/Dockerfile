FROM node:20.12.0-alpine AS base

RUN corepack enable

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN pnpm add -g turbo
RUN turbo telemetry disable

ARG DOCKER_ENV
ENV DOCKER_ENV=${DOCKER_ENV}
RUN echo "DOCKER_ENV value is: ${DOCKER_ENV}"

ARG AWS_ACCESS_KEY_ID
ENV AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}

ARG AWS_SECRET_ACCESS_KEY
ENV AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}

ARG TURBO_TEAM
ENV TURBO_TEAM=${TURBO_TEAM}

ARG TURBO_TOKEN
ENV TURBO_TOKEN=${TURBO_TOKEN}

ARG TURBO_REMOTE_CACHE_SIGNATURE_KEY
ENV TURBO_REMOTE_CACHE_SIGNATURE_KEY=${TURBO_REMOTE_CACHE_SIGNATURE_KEY}

ENV APP_NAME="web"
ENV APP_DIR="apps/web"
WORKDIR /app

FROM base AS pruner
COPY . .
RUN turbo prune web --docker

FROM base As builder
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=pruner /app/out/full/ ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

RUN pnpm --filter ${APP_NAME} ssm pull -e ${DOCKER_ENV}
RUN pnpm --filter ${APP_NAME} env:copy -e ${DOCKER_ENV}
RUN turbo build --filter=${APP_NAME} --remote-only

FROM base AS runner
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/${APP_DIR}/public /app/standalone/public
COPY --from=builder --chown=nextjs:nodejs /app/${APP_DIR}/.next/standalone /app/standalone
COPY --from=builder --chown=nextjs:nodejs /app/${APP_DIR}/.next/static /app/standalone/${APP_DIR}/.next/static

USER nextjs

WORKDIR /app/standalone/apps/${APP_NAME}

EXPOSE 3001

ENV PORT=3001
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]