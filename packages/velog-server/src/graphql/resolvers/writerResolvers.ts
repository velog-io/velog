import { Resolvers } from '@graphql/generated'
import { WriterService } from '@services/WriterService/index.js'
import { container } from 'tsyringe'

const writerResolvers: Resolvers = {
  Query: {
    trendingWriters: async (_, { input }) => {
      const { cursor, limit } = input
      const writerService = container.resolve(WriterService)
      return await writerService.getTrendingWriters(cursor, limit)
    },
  },
}

export default writerResolvers
