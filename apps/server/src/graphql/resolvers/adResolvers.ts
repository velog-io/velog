import { Resolvers } from '@graphql/helpers/generated'
import { AdService } from '@services/AdService/index.js'
import { container } from 'tsyringe'

const adResolver: Resolvers = {
  Query: {
    ads: async (_, { input }) => {
      const adService = container.resolve(AdService)
      return await adService.getAds(input)
    },
  },
}

export default adResolver
