import { Prisma } from '@prisma/velog-rds/client'

export type CurrentUser = Prisma.UserGetPayload<{
  include: {
    profile: true
  }
}>
