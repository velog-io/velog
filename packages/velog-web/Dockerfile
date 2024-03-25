FROM node:18-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

ARG DOCKER_ENV
ENV DOCKER_ENV=${DOCKER_ENV}
RUN echo "DOCKER_ENV value is: ${DOCKER_ENV}"

ARG AWS_ACCESS_KEY_ID
ENV AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}

ARG AWS_SECRET_ACCESS_KEY
ENV AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}

ENV APP_DIR="packages/velog-web"
RUN corepack enable

WORKDIR /app
COPY ./${APP_DIR} /app/${APP_DIR}
COPY ./package.json /app
COPY ./pnpm-lock.yaml /app/
COPY ./pnpm-workspace.yaml /app/

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
ENV NEXT_TELEMETRY_DISABLED 1
RUN pnpm -r ssm pull -e ${DOCKER_ENV}
RUN pnpm -r env:copy -e ${DOCKER_ENV}
RUN pnpm -r build

EXPOSE 3001

WORKDIR /app/${APP_DIR}

CMD ["pnpm", "start"]