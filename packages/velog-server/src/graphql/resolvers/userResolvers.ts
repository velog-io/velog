import { Resolvers } from '@graphql/generated'
import { FollowService } from '@services/FollowService/index.js'
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
      const followService = container.resolve(FollowService)
      await followService.follow(ctx.user?.id, input.followUserId)
    },
    unfollow: async (_, { input }, ctx) => {
      const followService = container.resolve(FollowService)
      await followService.unfllow(ctx.user?.id, input.followUserId)
    },
  },
}

export default userResolvers
