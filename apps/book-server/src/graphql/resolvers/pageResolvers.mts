import { Resolvers } from '@graphql/generated.js'
import { PageService } from '@services/PageService/index.mjs'
import { container } from 'tsyringe'

const pageResolvers: Resolvers = {
  Query: {
    getPageMetadata: async (_, { input }, ctx) => {
      const pageService = container.resolve(PageService)
      return await pageService.getPageMetadata(input.book_id, ctx.writer?.id)
    },
  },
}

export default pageResolvers
