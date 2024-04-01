import { Prisma } from '@packages/database/src/velog-rds.mjs'

export type CurrentUser = Prisma.UserGetPayload<{
  include: {
    profile: true
  }
}>
