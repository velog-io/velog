FROM node:18-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

ENV APP_DIR="packages/velog-web"
RUN corepack enable

ARG DOCKER_ENV

WORKDIR /app
COPY ./${APP_DIR} /app/${APP_DIR}
COPY ./package.json /app
COPY ./pnpm-lock.yaml /app/
COPY ./pnpm-workspace.yaml /app/

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

ENV NEXT_TELEMETRY_DISABLED 1

COPY ${APP_DIR}/scripts/entrypoint.sh ${APP_DIR}/scripts/entrypoint.sh
RUN chmod +x ${APP_DIR}/scripts/entrypoint.sh

ARG DOCKER_ENV
ENV DOCKER_ENV=${DOCKER_ENV}
RUN echo "DOCKER_ENV value is: ${DOCKER_ENV}"
RUN pnpm -r build

EXPOSE 3001

WORKDIR /app/${APP_DIR}
CMD ["/app/packages/velog-web/scripts/entrypoint.sh"]


# FROM base
# COPY --from=prod-deps /app/node_modules /app/${APP_DIR}/node_modules
# COPY --from=build /app/.next /app/${APP_DIR}/.next

# FROM base AS build
# RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
# RUN pnpm build

# FROM base
# COPY --from=prod-deps /app/node_modules /app/node_modules
# COPY --from=build /app/dist /app/dist

# ENV NEXT_TELEMETRY_DISABLED 1

# COPY ${APP_DIR}/scripts/entrypoint.sh /scripts/entrypoint.sh
# RUN chmod +x /scripts/entrypoint.sh

# ARG DOCKER_ENV
# ENV DOCKER_ENV=${DOCKER_ENV}
# RUN echo "DOCKER_ENV value is: ${DOCKER_ENV}"

# EXPOSE 3001

# CMD ["${APP_DIR}/scripts/entrypoint.sh"]



# FROM node:18-alpine
# RUN apk add --no-cache libc6-compat
# RUN npm install -g pnpm
# RUN mkdir -p /app
# WORKDIR /app
# COPY --from=builder /app/ /app/
# COPY . .

# # # Next.js collects completely anonymous telemetry data about general usage.
# # # Learn more here: https://nextjs.org/telemetry
# # # Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

# COPY /scripts/entrypoint.sh /scripts/entrypoint.sh
# RUN chmod +x /scripts/entrypoint.sh

# ARG DOCKER_ENV
# ENV DOCKER_ENV=${DOCKER_ENV}
# RUN echo "DOCKER_ENV value is: ${DOCKER_ENV}"

# RUN pnpm env:copy -e ${DOCKER_ENV}
# RUN pnpm build

# EXPOSE 3001

# CMD ["/scripts/entrypoint.sh"]