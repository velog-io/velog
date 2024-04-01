FROM node:18.16.0-alpine AS base

RUN corepack enable

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN pnpm add -g prisma
RUN pnpm add -g turbo 

ARG DOCKER_ENV
ENV DOCKER_ENV=${DOCKER_ENV}
RUN echo "DOCKER_ENV value is: ${DOCKER_ENV}"

ARG AWS_ACCESS_KEY_ID
ENV AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}

ARG AWS_SECRET_ACCESS_KEY
ENV AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}

ENV APP_DIR="apps/server"

WORKDIR /app/${APP_DIR}

COPY ./package*.json /app
COPY ./pnpm-*.yaml /app
COPY ./${APP_DIR} /app/${APP_DIR}
COPY ./packages/database /app/packages/database

RUN turbo telemetry disable

RUN turbo prune server --docker
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm prisma:generate --filter @packages/database

FROM base As builder
RUN pnpm ssm pull -e ${DOCKER_ENV}
RUN pnpm build:prod

FROM base As runner
COPY --from=builder /app/${APP_DIR}/dist /app/${APP_DIR}/dist
COPY --from=builder /app/${APP_DIR}/env /app/${APP_DIR}/env

EXPOSE 5003

CMD [ "pnpm", "start" ]