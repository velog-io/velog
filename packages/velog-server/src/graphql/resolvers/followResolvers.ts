import { Resolvers } from '@graphql/generated'
import { UserFollowService } from '@services/UserFollowService/index.js'
import { container } from 'tsyringe'

const followerResolvers: Resolvers = {
  Query: {
    followers: async (_, { input }, ctx) => {
      const userFollowService = container.resolve(UserFollowService)
      return await userFollowService.getFollowers(input, ctx.user?.id)
    },
    followings: async (_, { input }, ctx) => {
      const userFollowService = container.resolve(UserFollowService)
      return await userFollowService.getFollowings(input, ctx.user?.id)
    },
  },
  Mutation: {
    follow: async (_, { input }, ctx) => {
      const userFollowService = container.resolve(UserFollowService)
      await userFollowService.follow({
        followerUserId: ctx.user?.id,
        followingUserId: input.followingUserId,
      })
      return true
    },
    unfollow: async (_, { input }, ctx) => {
      const userFollowService = container.resolve(UserFollowService)
      await userFollowService.unfollow({
        followerUserId: ctx.user?.id,
        followingUserId: input.followingUserId,
      })
      return true
    },
  },
}

export default followerResolvers
