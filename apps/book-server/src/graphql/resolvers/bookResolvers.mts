import { Resolvers } from '@graphql/helpers/generated'
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
      return await bookService.getBook(input.bookId)
    },
  },
}

export default bookResolvers
