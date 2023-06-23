import { Prisma } from '@prisma/client'

const currentUserInclude = Prisma.validator<Prisma.UserInclude>()({
  userProfile: true,
})

export type CurrentUser = Prisma.UserGetPayload<{ include: typeof currentUserInclude }>
