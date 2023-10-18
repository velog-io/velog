import { Resolvers } from '@graphql/generated'
import { FollowUserService } from '@services/FollowUserService'
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
    recommendFollowers: async () => {
      const followUserService = container.resolve(FollowUserService)
      return followUserService.getRecommededFollowers()
    },
  },
}

export default followerResolvers
