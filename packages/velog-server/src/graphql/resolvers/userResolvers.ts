import { Resolvers } from '@graphql/generated'
import { AuthService } from '@services/AuthService/index.js'
import { SeriesService } from '@services/SeriesService/index.js'
import { UserMetaService } from '@services/UserMetaService/index.js'
import { UserProfileService } from '@services/UserProfileService/index.js'

import { UserService } from '@services/UserService/index.js'
import { VelogConfigService } from '@services/VelogConfigService/index.js'
import { container } from 'tsyringe'

const userResolvers: Resolvers = {
  User: {
    profile: async (parent) => {
      const userProfileService = container.resolve(UserProfileService)
      const loader = userProfileService.userProfileLoader()
      return loader.load(parent.id)
    },
    velog_config: async (parent) => {
      const velogConfigService = container.resolve(VelogConfigService)
      const laoder = velogConfigService.velogConfigLoader()
      return laoder.load(parent.id)
    },
    email: (parent, _, ctx) => {
      const userService = container.resolve(UserService)
      userService.emailGuard(parent, ctx.user?.id)
      return parent.email
    },
    series_list: async (parent) => {
      const seriesService = container.resolve(SeriesService)
      return await seriesService.findByUserId(parent.id)
    },
    user_meta: async (parent, _, ctx) => {
      const userMetaService = container.resolve(UserMetaService)
      return await userMetaService.findByUserId(parent, ctx.user?.id)
    },
  },
  Query: {
    user: async (_, { input }) => {
      const { id: userId, username } = input
      const userService = container.resolve(UserService)
      return await userService.findByIdOrUsername({ userId, username })
    },
    velogConfig: async (_, { input }) => {
      const velogConfigSerivce = container.resolve(VelogConfigService)
      return await velogConfigSerivce.findByUsername(input.username)
    },
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
    updateAbout: async (_, { input }, ctx) => {
      const userProfileService = container.resolve(UserProfileService)
      return await userProfileService.updateUserProfile({ ...input }, ctx.user?.id)
    },
  },
}

export default userResolvers
