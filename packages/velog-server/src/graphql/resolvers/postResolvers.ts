import { Resolvers } from '@graphql/generated'
import { container } from 'tsyringe'
import { PostService } from '@services/PostService/index.js'

const postResolvers: Resolvers = {
  Query: {
    recentPosts: async (_, { input }, ctx) => {
      const postService = container.resolve(PostService)
      return postService.getRecentPosts(input, ctx.user?.id)
    },
    readingList: async (_, { input }, ctx) => {
      const postService = container.resolve(PostService)
      return postService.getReadingList(input, ctx.user?.id)
    },
  },
}

export default postResolvers
