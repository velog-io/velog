import { Resolvers } from '@graphql/generated'
import { WriterService } from '@services/WriterService/index.js'
import { container } from 'tsyringe'

const writerResolvers: Resolvers = {
  Query: {
    trendingWriters: async (_, { input }) => {
      const { cursor, take } = input
      const writerService = container.resolve(WriterService)
      return writerService.getTrendingWriters(cursor, take)
    },
  },
}

export default writerResolvers
