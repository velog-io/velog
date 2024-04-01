import { Prisma } from '@packages/database/src/velog-rds/index.mjs'

export type CurrentUser = Prisma.UserGetPayload<{
  include: {
    profile: true
  }
}>
