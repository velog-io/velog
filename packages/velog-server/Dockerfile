FROM node:18-alpine AS base

RUN corepack enable

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN apk add --no-cache libc6-compat
RUN pnpm install -g prisma

ARG DOCKER_ENV
ENV DOCKER_ENV=${DOCKER_ENV}
RUN echo "DOCKER_ENV value is: ${DOCKER_ENV}"

ARG AWS_ACCESS_KEY_ID
ENV AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}

ARG AWS_SECRET_ACCESS_KEY
ENV AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}

ENV APP_DIR="packages/velog-server"

WORKDIR /app
COPY ./${APP_DIR} /app/${APP_DIR}
COPY ./package*.json /app
COPY ./pnpm-*.yaml /app

FROM base As installer
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base As runner
COPY --from=installer /app/${APP_DIR}/node_modules /app/${APP_DIR}/node_modules

WORKDIR /app/${APP_DIR}
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install -D typescript

RUN pnpm ssm pull -e ${DOCKER_ENV}
# prisma를 모듈로 import 하도록 변경해야함, turborepo 도입 이후에 변경 할 것
RUN pnpm prisma generate
RUN pnpm build

EXPOSE 5003

CMD ["pnpm", "start"]
