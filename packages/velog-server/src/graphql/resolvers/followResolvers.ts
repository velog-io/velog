import { Resolvers } from '@graphql/generated'
import { FollowUserService } from '@services/FollowUserService/index.js'
import { container } from 'tsyringe'

const followerResolvers: Resolvers = {
  Query: {
    followers: async (_, { input }) => {
      const { userId } = input
      const followUserService = container.resolve(FollowUserService)
      return followUserService.getFollowers(userId)
    },
    followings: async (_, { input }) => {
      const { userId } = input
      const followUserService = container.resolve(FollowUserService)
      return followUserService.getFollowings(userId)
    },
    recommendFollowers: async (_, { input }) => {
      const { page, take } = input
      const followUserService = container.resolve(FollowUserService)
      return followUserService.getRecommededFollowers(page, take)
    },
  },
}

export default followerResolvers
