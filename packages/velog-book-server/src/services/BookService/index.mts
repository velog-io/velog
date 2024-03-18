import { NotFoundError } from '@errors/NotfoundError.mjs'
import { MongoService } from '@lib/mongo/MongoService.mjs'
import { injectable, singleton } from 'tsyringe'
import { Page } from '@prisma/velog-book-mongo/client/index.js'
import { BadRequestError } from '@errors/BadRequestErrors.mjs'

interface Service {}

@injectable()
@singleton()
export class BookService implements Service {
  constructor(private readonly mongo: MongoService) {}
  public async getBook(bookId: string, signedWriterId?: string) {
    if (!bookId) {
      throw new BadRequestError('Not found book')
    }

    const book = await this.mongo.book.findUnique({
      where: {
        id: bookId,
      },
    })

    if (!book) {
      throw new NotFoundError('Not found book')
    }

    const pages = await this.organizePages(bookId)
    console.log(pages[0].childrens?.[0])
  }
  private async organizePages(bookId: string): Promise<PageData[]> {
    const pages = await this.mongo.page.findMany({
      where: {
        bookId: bookId,
      },
    })

    console.log('pages', pages.length)
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
