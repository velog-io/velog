import { Resolvers } from '@graphql/generated'
import { FollowService } from '@services/FollowService/index.js'

import { container } from 'tsyringe'

const followerResolvers: Resolvers = {
  Query: {
    followers: async (_, { input }) => {
      const followService = container.resolve(FollowService)
      return followService.getFollowers(input)
    },
    followings: async (_, { input }) => {
      const followService = container.resolve(FollowService)
      return followService.getFollowings(input)
    },
    recommendFollowings: async (_, { input }) => {
      const { page, take } = input
      const followService = container.resolve(FollowService)
      return followService.getRecommededFollowers(page, take)
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
