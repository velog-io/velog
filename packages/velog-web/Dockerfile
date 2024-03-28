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
COPY ./package*.json /app
COPY ./pnpm-*.yaml /app

FROM base As installer
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

FROM base As builder
COPY --from=installer /app/${APP_DIR}/node_modules /app/${APP_DIR}/node_modules
COPY --from=installer /app/node_modules /app/node_modules

ENV NEXT_TELEMETRY_DISABLED 1
RUN pnpm -r ssm pull -e ${DOCKER_ENV}
RUN pnpm -r env:copy -e ${DOCKER_ENV}
RUN pnpm -r build

FROM base AS runner
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/${APP_DIR}/public /app/standalone/public
COPY --from=builder --chown=nextjs:nodejs /app/${APP_DIR}/.next/standalone /app/standalone
COPY --from=builder --chown=nextjs:nodejs /app/${APP_DIR}/.next/static /app/standalone/${APP_DIR}/.next/static

RUN rm -rf ./packages

USER nextjs

WORKDIR /app/standalone/packages/velog-web

EXPOSE 3001

ENV PORT=3001
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]