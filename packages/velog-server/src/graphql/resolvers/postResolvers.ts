import { Resolvers } from '@graphql/generated'
import { container } from 'tsyringe'
import { PostService } from '@services/PostService/index.js'
import { UserService } from '@services/UserService/index.js'
import { PostWith } from '@services/PostService/PostServiceInterface.js'
import removeMd from 'remove-markdown'

const postResolvers: Resolvers = {
  Post: {
    user: async (parent: PostWith) => {
      if (!parent?.user) {
        const userService = container.resolve(UserService)
        return await userService.getCurrentUser(parent.fk_user_id)
      }
      return parent.user
    },
    short_description: (parent: PostWith) => {
      if (!parent.body) return ''
      if ((parent.meta as any)?.short_description) {
        return (parent.meta as any).short_description
      }

      const removed = removeMd(
        parent.body
          .replace(/```([\s\S]*?)```/g, '')
          .replace(/~~~([\s\S]*?)~~~/g, '')
          .slice(0, 500)
      )
      return removed.slice(0, 200) + (removed.length > 200 ? '...' : '')
    },
  },
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
