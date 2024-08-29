FROM node:20.16.0-alpine AS base
RUN apk update
RUN apk add --no-cache libc6-compat

RUN corepack enable

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN pnpm add -g turbo prisma
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
ENV TURBO_REMOTE_CACHE_SIGNATURE_KEY=$TURBO_REMOTE_CACHE_SIGNATURE_KEY

ENV APP_NAME="cron"
ENV APP_DIR="apps/${APP_NAME}"
RUN echo "APP_DIR value is: ${APP_DIR}"

WORKDIR /app

FROM base AS pruner
COPY . .
RUN turbo prune ${APP_NAME} --docker

FROM base As builder
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=pruner /app/out/json/ ./
COPY --from=pruner /app/out/full/ ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prefer-frozen-lockfile

RUN pnpm --filter @packages/database prisma:generate
RUN pnpm --filter ${APP_NAME} ssm pull -e ${DOCKER_ENV}
RUN turbo build --filter=${APP_NAME} --remote-only

FROM base As runner
COPY --from=builder /app/package*.json .
COPY --from=builder /app/pnpm-*.yaml .
COPY --from=builder /app/packages/ /app/packages

WORKDIR /app/${APP_DIR}

COPY --from=builder /app/${APP_DIR}/dist /app/${APP_DIR}/dist
COPY --from=builder /app/${APP_DIR}/*.json .
COPY --from=builder /app/${APP_DIR}/env /app/${APP_DIR}/env

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

EXPOSE 5003

CMD [ "pnpm", "start" ]
