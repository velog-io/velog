import { Resolvers } from '@graphql/generated'
import { container } from 'tsyringe'
import { PostService } from '@services/PostService/index.js'
import { UserService } from '@services/UserService/index.js'
import { PostAllInclude } from '@services/PostService/PostServiceInterface.js'
import removeMd from 'remove-markdown'
import { CommentService } from '@services/CommentService/index.js'

const postResolvers: Resolvers = {
  Post: {
    user: async (parent: PostAllInclude) => {
      if (!parent.user) {
        const userService = container.resolve(UserService)
        return await userService.getCurrentUser(parent.fk_user_id)
      }
      return parent.user
    },
    short_description: (parent: PostAllInclude) => {
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
    comments_count: async (parent: PostAllInclude) => {
      if (parent?.comment) return parent.comment.length
      const commentService = container.resolve(CommentService)
      const count = await commentService.count(parent.id)
      return count
    },
  },
  Query: {
    post: async (_, { input }, ctx) => {
      const postService = container.resolve(PostService)
      return await postService.getPost(input, ctx.user?.id)
    },
    recentPosts: async (_, { input }, ctx) => {
      const postService = container.resolve(PostService)
      return await postService.getRecentPosts(input, ctx.user?.id)
    },
    trendingPosts: async (_, { input }, ctx) => {
      const postService = container.resolve(PostService)
      return await postService.getTrendingPosts(input, ctx.ip)
    },
    readingList: async (_, { input }, ctx) => {
      const postService = container.resolve(PostService)
      return await postService.getReadingList(input, ctx.user?.id)
    },
  },
}

export default postResolvers
