import { Resolvers } from '@graphql/helpers/generated.js'
import { BookDeployService } from 'src/services/BookDeployService/index.mjs'
import { BookService } from 'src/services/BookService/index.mjs'
import { PageService } from 'src/services/PageService/index.mjs'
import { container } from 'tsyringe'

const bookResolvers: Resolvers = {
  Book: {
    pages: async (parent) => {
      if (!parent) return []
      const pageService = container.resolve(PageService)
      return await pageService.organizePages(parent.id)
    },
  },
  Query: {
    book: async (_, { input }) => {
      const bookService = container.resolve(BookService)
      return await bookService.getBook(input.book_id)
    },
  },
  Mutation: {
    deploy: async (_, { input }, { pubsub }) => {
      const bookDeployService = container.resolve(BookDeployService)
      return await bookDeployService.deploy(input.book_id)
    },
  },
  Subscription: {
    bookDeploy: {
      subscribe: async (parent, { input }, { pubsub }) => {
        return await pubsub.subscribe('hello')
      },
    },
  },
}

export default bookResolvers
