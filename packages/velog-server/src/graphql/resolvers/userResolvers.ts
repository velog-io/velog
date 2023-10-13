import { Resolvers } from '@graphql/generated'
import { AuthService } from '@services/AuthService'
import { UserFollowService } from '@services/UserFollowService/index.js'
import { UserProfileService } from '@services/UserProfileService'
import { UserService } from '@services/UserService/index.js'
import { container } from 'tsyringe'

const userResolvers: Resolvers = {
  User: {
    profile: async (parent) => {
      const userProfileService = container.resolve(UserProfileService)
      return await userProfileService.getProfile(parent.id)
    },
  },
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
      const authService = container.resolve(AuthService)
      await authService.logout(ctx.reply)
    },
    follow: async (_, { input }, ctx) => {
      const userFollowService = container.resolve(UserFollowService)
      await userFollowService.follow(ctx.user?.id, input.followUserId)
      return true
    },
    unfollow: async (_, { input }, ctx) => {
      const userFollowService = container.resolve(UserFollowService)
      await userFollowService.unfollow(ctx.user?.id, input.followUserId)
      return true
    },
  },
}

export default userResolvers
