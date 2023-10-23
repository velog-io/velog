#!/bin/sh

if [ "$DOCKER_ENV" = "production" ]; then
  echo "Entrypoint shell running in production mode..."
  pnpm prod
elif [ "$DOCKER_ENV" = "stage" ]; then
  echo "Entrypoint shell running in staging mode..."
  pnpm stage
else
  echo "Unknown DOCKER_ENV value: $DOCKER_ENV"
  exit 1
fi