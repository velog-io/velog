import { Prisma } from '@prisma/client'

export type CurrentUser = Prisma.UserGetPayload<{
  include: {
    profile: true
  }
}>
