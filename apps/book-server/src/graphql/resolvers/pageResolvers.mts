import { Resolvers } from '@graphql/generated.js'
import { PageService } from '@services/PageService/index.mjs'
import { container } from 'tsyringe'

const pageResolvers: Resolvers = {
  Query: {
    pages: async (_, { input }, ctx) => {
      const pageService = container.resolve(PageService)
      return await pageService.getPages(input.book_url_slug, ctx.writer?.id)
    },
  },
}

export default pageResolvers
