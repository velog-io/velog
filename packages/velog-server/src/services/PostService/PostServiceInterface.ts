import { Prisma } from '@prisma/client'

export type PostAllInclude = Prisma.PostGetPayload<{
  include: {
    user?: {
      select: {
        profile: true
      }
    }
    feed?: true
    postCategory?: true
    postHistory?: true
    postImage?: true
    postLike?: true
    postRead?: true
    postReadLog?: true
    postScore?: true
    postTagLegacy?: true
    seriesPost?: true
    urlSlugHistory?: true
    postTags?: true
    comment?: true
  }
}>

export type GetPostsByTypeParams = {
  cursor: string | undefined
  userId: string
  limit: number
}
