import { Resolvers } from '@graphql/generated'
import { container } from 'tsyringe'
import { PostService } from '@services/PostService/index.js'

const postResolvers: Resolvers = {
  Query: {
    post: async (_, { input }, ctx) => {
      const postService = container.resolve(PostService)
      return postService.getPost(input, ctx.user?.id)
    },
    recentPosts: async (_, { input }, ctx) => {
      const postService = container.resolve(PostService)
      return postService.getRecentPosts(input, ctx.user?.id)
    },
    trendingPosts: async (_, { input }, ctx) => {
      const postService = container.resolve(PostService)
      return postService.getTrendingPosts(input, ctx.ip)
    },
    readingList: async (_, { input }, ctx) => {
      const postService = container.resolve(PostService)
      return postService.getReadingList(input, ctx.user?.id)
    },
  },
}

export default postResolvers
