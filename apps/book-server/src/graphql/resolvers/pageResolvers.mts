import { Resolvers } from '@graphql/generated.js'
import { PageService } from '@services/PageService/index.mjs'
import { container } from 'tsyringe'

const pageResolvers: Resolvers = {
  Query: {
    pages: async (_, { input }, ctx) => {
      const pageService = container.resolve(PageService)
      return await pageService.getPages(input.book_url_slug, ctx.writer?.id)
    },
    page: async (_, { input }, ctx) => {
      const pageService = container.resolve(PageService)
      return await pageService.getPage(input, ctx.writer?.id)
    },
  },
  Mutation: {
    create: async (_, { input }, ctx) => {
      const pageService = container.resolve(PageService)
      return await pageService.create(input, ctx.writer?.id)
    },
    reorder: async (_, { input }, ctx) => {
      const pageService = container.resolve(PageService)
      await pageService.reorder(input, ctx.writer?.id)
    },
    update: async (_, { input }, ctx) => {
      const pageService = container.resolve(PageService)
      return await pageService.update(input, ctx.writer?.id)
    },
    delete: async (_, { input }, ctx) => {
      const pageService = container.resolve(PageService)
      return await pageService.delete(input, ctx.writer?.id)
    },
  },
}

export default pageResolvers
