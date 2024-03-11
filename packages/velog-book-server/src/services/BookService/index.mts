import { NotFoundError } from '@errors/NotfoundError.mjs'
import { MongoService } from '@lib/mongo/MongoService.mjs'
import { injectable, singleton } from 'tsyringe'
import { Page } from '@prisma/velog-book-mongo/client/index.js'

interface Service {}

@injectable()
@singleton()
export class BookService implements Service {
  constructor(private readonly mongo: MongoService) {}
  async organizeBooks(bookId: string) {
    const book = await this.mongo.book.findUnique({
      where: {
        id: bookId,
      },
    })

    if (!book) {
      throw new NotFoundError('Not found book')
    }

    const pages = await this.mongo.page.findMany({
      where: {
        bookId: book.id,
      },
    })

    const bookMap = new Map()
    const topLevelBooks: Page[] = []

    pages.forEach((page) => {
      if (page.parentId === null) {
        topLevelBooks.push(page)
      } else {
        if (!bookMap.has(page.parentId)) {
          bookMap.set(page.parentId, [])
        }
        bookMap.get(page.parentId).push(page)
      }
    })

    function buildHierarchy(page: PageData) {
      if (bookMap.has(page.id)) {
        page.childrens = bookMap.get(page.id)
        page.childrens?.forEach(buildHierarchy)
      }
    }

    topLevelBooks.forEach(buildHierarchy)
    return topLevelBooks
  }
}

type PageData = {
  childrens?: Page[]
} & Page
