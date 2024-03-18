import { Resolvers } from '@graphql/helpers/generated'
import { BookService } from 'src/services/BookService/index.mjs'
import { container } from 'tsyringe'

const bookResolvers: Resolvers = {
  Query: {
    book: async (_, { input }) => {
      const bookService = container.resolve(BookService)
      return await bookService.getBook(input.bookId)
    },
  },
}

export default bookResolvers
