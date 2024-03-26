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

ENV APP_DIR="packages/velog-server"
RUN corepack enable

WORKDIR /app
COPY ./${APP_DIR} /app/${APP_DIR}
COPY ./package*.json /app
COPY ./pnpm-*.yaml /app

FROM base As installer
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

FROM base As builder
COPY --from=installer /app/${APP_DIR}/node_modules /app/${APP_DIR}/node_modules
COPY --from=installer /app/node_modules /app/node_modules
RUN pnpm -r ssm pull -e ${DOCKER_ENV}
RUN pnpm -r env:copy -e ${DOCKER_ENV}
RUN pnpm prisma:init
RUN pnpm -r build


FROM base AS runner
COPY --from=builder /app/${APP_DIR}/dist /app/dist

RUN rm -rf ./packages

EXPOSE 5003

