#!/bin/sh

if [ "$NODE_ENV" = "production" ]; then
  pnpm prod
else
  pnpm stage
fi
