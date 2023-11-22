import { Resolvers } from '@graphql/generated'
import { FollowService } from '@services/FollowService/index.js'
import { container } from 'tsyringe'

const followerResolvers: Resolvers = {
  Query: {
    followers: async (_, { input }, ctx) => {
      const followService = container.resolve(FollowService)
      return await followService.getFollowers(input, ctx.user?.id)
    },
    followings: async (_, { input }, ctx) => {
      const followService = container.resolve(FollowService)
      return await followService.getFollowings(input, ctx.user?.id)
    },
  },
  Mutation: {
    follow: async (_, { input }, ctx) => {
      const followService = container.resolve(FollowService)
      await followService.follow({
        followerUserId: ctx.user?.id,
        followingUserId: input.followingUserId,
      })
      return true
    },
    unfollow: async (_, { input }, ctx) => {
      const followService = container.resolve(FollowService)
      await followService.unfollow({
        followerUserId: ctx.user?.id,
        followingUserId: input.followingUserId,
      })
      return true
    },
  },
}

export default followerResolvers
