import { Resolvers } from '@graphql/helpers/generated.js'
import { FollowUserService } from '@services/FollowUser/index.js'
import { container } from 'tsyringe'

const followerResolvers: Resolvers = {
  Query: {
    followers: async (_, { input }, ctx) => {
      const followUserService = container.resolve(FollowUserService)
      return await followUserService.getFollowers(input, ctx.user?.id)
    },
    followings: async (_, { input }, ctx) => {
      const followUserService = container.resolve(FollowUserService)
      return await followUserService.getFollowings(input, ctx.user?.id)
    },
  },
  Mutation: {
    follow: async (_, { input }, ctx) => {
      const followUserService = container.resolve(FollowUserService)
      await followUserService.follow({
        followerUserId: ctx.user?.id,
        followingUserId: input.followingUserId,
      })
      return true
    },
    unfollow: async (_, { input }, ctx) => {
      const followUserService = container.resolve(FollowUserService)
      await followUserService.unfollow({
        followerUserId: ctx.user?.id,
        followingUserId: input.followingUserId,
      })
      return true
    },
  },
}

export default followerResolvers
