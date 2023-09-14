import { Resolvers } from '@graphql/generated'
import { UserFollowService } from '@services/UserFollowService/index.js'
import { UserService } from '@services/UserService/index.js'
import { container } from 'tsyringe'

const userResolvers: Resolvers = {
  Query: {
    currentUser: async (_, __, ctx) => {
      const userService = container.resolve(UserService)
      return await userService.getCurrentUser(ctx.user?.id)
    },
    restoreToken: async (_, __, ctx) => {
      const userService = container.resolve(UserService)
      return await userService.restoreToken(ctx)
    },
  },
  Mutation: {
    logout: async (_, __, ctx) => {
      const userService = container.resolve(UserService)
      await userService.logout(ctx.reply)
    },
    follow: async (_, { input }, ctx) => {
      const userFollowService = container.resolve(UserFollowService)
      await userFollowService.follow(ctx.user?.id, input.followUserId)
      return true
    },
    unfollow: async (_, { input }, ctx) => {
      const userFollowService = container.resolve(UserFollowService)
      await userFollowService.unfllow(ctx.user?.id, input.followUserId)
      return true
    },
  },
}

export default userResolvers
