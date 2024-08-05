import { Prisma } from '@packages/database/velog-rds'

export type CurrentUser = Prisma.UserGetPayload<{
  include: {
    profile: true
  }
}>
