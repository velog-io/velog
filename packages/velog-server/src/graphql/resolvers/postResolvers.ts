import { Post } from '@prisma/client'
import { Resolvers } from '@graphql/generated'
import { BadRequestError } from '@errors/badRequestErrors'
import { UserService } from '@services/UserService/index.js'
import { container } from 'tsyringe'
import { UnauthorizedError } from '@errors/unauthorizedError'
import { PostService } from '@services/PostService'

const postResolvers: Resolvers = {
  Query: {
    readingList: async (parent, { input }, ctx) => {
      const { cursor, limit = 20, type } = input
      if (limit && limit > 100) {
        throw new BadRequestError('Max limit is 100')
      }
      if (!ctx.user?.id) {
        throw new UnauthorizedError('Not Logged In')
      }

      const postService = container.resolve(PostService)
      return await postService.getPostsLikedType(
        cursor as any,
        ctx.user.id,
        limit!
      )
      // if (type === 'LIKED') {
      //   return await postService.getPostsLikedType(
      //     cursor as any,
      //     ctx.user.id,
      //     limit!
      //   )
      // }
    },
  },
}

type ReadingListQueryParams = {
  type: 'LIKED' | 'READ'
  limit: number
  cursor?: string
}

export default postResolvers
