FROM node:18-alpine AS base

RUN corepack enable

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN pnpm install -g prisma

ARG DOCKER_ENV
ENV DOCKER_ENV=${DOCKER_ENV}
RUN echo "DOCKER_ENV value is: ${DOCKER_ENV}"

ARG AWS_ACCESS_KEY_ID
ENV AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}

ARG AWS_SECRET_ACCESS_KEY
ENV AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}

ENV APP_DIR="packages/velog-server"

WORKDIR /app/${APP_DIR}

COPY ./package*.json /app
COPY ./pnpm-*.yaml /app
COPY ./${APP_DIR} /app/${APP_DIR}

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
# TODO: prisma를 모듈로 import 하도록 변경해야함, turborepo 도입 이후에 변경 할 것
RUN pnpm prisma generate

FROM base As builder
RUN pnpm ssm pull -e ${DOCKER_ENV}
RUN pnpm build

FROM base As runner
COPY --from=builder /app/${APP_DIR}/dist /app/${APP_DIR}/dist
COPY --from=builder /app/${APP_DIR}/env /app/${APP_DIR}/env

EXPOSE 5003

CMD [ "pnpm", "start" ]