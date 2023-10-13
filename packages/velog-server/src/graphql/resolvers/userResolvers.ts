import { Resolvers } from '@graphql/generated'
import { FollowUserService } from '@services/FollowUserService/index.js'
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
    followers: async (_, __, ctx) => {
      const followUserService = container.resolve(FollowUserService)
      return followUserService.getFollower(ctx.user?.id)
    },
  },
  Mutation: {
    logout: async (_, __, ctx) => {
      const userService = container.resolve(UserService)
      await userService.logout(ctx.reply)
    },
    follow: async (_, { input }, ctx) => {
      const followUserService = container.resolve(FollowUserService)
      await followUserService.follow(ctx.user?.id, input.followUserId)
      return true
    },
    unfollow: async (_, { input }, ctx) => {
      const followUserService = container.resolve(FollowUserService)
      await followUserService.unfollow(ctx.user?.id, input.followUserId)
      return true
    },
  },
}

export default userResolvers
