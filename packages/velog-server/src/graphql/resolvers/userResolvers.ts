import { Resolvers } from '@graphql/helpers/generated'
import { AuthService } from '@services/AuthService/index.js'
import { FollowUserService } from '@services/FollowUser/index.js'
import { SeriesService } from '@services/SeriesService/index.js'
import { UserMetaService } from '@services/UserMetaService/index.js'
import { UserProfileService } from '@services/UserProfileService/index.js'
import {} from '@prisma/client'
import { UserService } from '@services/UserService/index.js'
import { VelogConfigService } from '@services/VelogConfigService/index.js'
import { container } from 'tsyringe'
import { ExternalIntegrationService } from '@services/ExternalIntegrationService/index.js'
import { JwtService } from '@lib/jwt/JwtService.js'

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
      userService.verifyEmailAccessPermission(parent, ctx.user?.id)
      return parent.email
    },
    series_list: async (parent) => {
      const seriesService = container.resolve(SeriesService)
      return await seriesService.findByUserId(parent.id)
    },
    user_meta: async (parent, _, ctx) => {
      const userMetaService = container.resolve(UserMetaService)
      return await userMetaService.getMyMeta(parent, ctx.user?.id)
    },
    followers_count: async (parent) => {
      const { username } = parent
      const followUserService = container.resolve(FollowUserService)
      return await followUserService.getFollowersCount(username)
    },
    followings_count: async (parent) => {
      const { username } = parent
      const followUserService = container.resolve(FollowUserService)
      return await followUserService.getFollowingsCount(username)
    },
    is_followed: async (parent, _, ctx) => {
      const followUserService = container.resolve(FollowUserService)
      return await followUserService.isFollowed({
        followingUserId: parent.id,
        followerUserId: ctx.user?.id,
      })
    },
    is_trusted: async (parent) => {
      const userService = container.resolve(UserService)
      return await userService.checkTrust(parent.id)
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
      await userService.updateLastAccessedAt(ctx.user?.id)
      return await userService.getCurrentUser(ctx.user?.id)
    },
    restoreToken: async (_, __, ctx) => {
      const userService = container.resolve(UserService)
      return await userService.restoreToken(ctx)
    },
    unregisterToken: async (_, __, ctx) => {
      const jwtService = container.resolve(JwtService)
      return jwtService.unregisterUserToken(ctx.user?.id)
    },
    checkEmailExists: async (_, { input }) => {
      const userService = container.resolve(UserService)
      const user = await userService.findByEmail(input.email)
      console.log('user', user)
      return !!user
    },
  },
  Mutation: {
    logout: async (_, __, ctx) => {
      const authService = container.resolve(AuthService)
      await authService.logout(ctx.reply)
    },
    updateAbout: async (_, { input }, ctx) => {
      const userProfileService = container.resolve(UserProfileService)
      return await userProfileService.updateUserProfile({ about: input.about }, ctx.user?.id)
    },
    updateThumbnail: async (_, { input }, ctx) => {
      const userProfileService = container.resolve(UserProfileService)
      return await userProfileService.updateUserProfile({ thumbnail: input.url }, ctx.user?.id)
    },
    updateProfile: async (_, { input }, ctx) => {
      const userProfileService = container.resolve(UserProfileService)
      return await userProfileService.updateUserProfile(
        { display_name: input.display_name, short_bio: input.short_bio.slice(0, 255) },
        ctx.user?.id,
      )
    },
    updateVelogTitle: async (_, { input }, ctx) => {
      const velogConfigService = container.resolve(VelogConfigService)
      return await velogConfigService.updateVelogConfig(input.title, ctx.user?.id)
    },
    updateSocialInfo: async (_, { input }, ctx) => {
      const userProfileService = container.resolve(UserProfileService)
      const profileLinks: Record<string, any> = input.profile_links
      return await userProfileService.updateUserProfile(
        {
          profile_links: profileLinks,
        },
        ctx.user?.id,
      )
    },
    updateEmailRules: async (_, { input }, ctx) => {
      const userMetaService = container.resolve(UserMetaService)
      return await userMetaService.updateUserMeta(
        {
          email_notification: input.notification,
          email_promotion: input.promotion,
        },
        ctx.user?.id,
      )
    },
    unregister: async (_, { input }, ctx) => {
      const userService = container.resolve(UserService)
      return await userService.unregister(ctx.reply, input.token, ctx.user?.id)
    },
    acceptIntegration: async (_, __, ctx) => {
      const externalIntegrationService = container.resolve(ExternalIntegrationService)
      return await externalIntegrationService.createIntegrationCode(ctx.user?.id)
    },
    initiateChangeEmail: async (_, { input }, ctx) => {
      const userService = container.resolve(UserService)
      return await userService.initiateChangeEmail(input.email, ctx.user?.id)
    },
    confirmChangeEmail: async (_, { input }, ctx) => {
      const userService = container.resolve(UserService)
      return await userService.confirmChangeEmail(input.code, ctx.user?.id)
    },
  },
}

export default userResolvers
