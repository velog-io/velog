import { Page } from '@graphql/generated.js'
import { MongoService } from '@lib/mongo/MongoService.mjs'
import { injectable, singleton } from 'tsyringe'

interface Service {
  organizePages(bookId: string): Promise<PageData[]>
}

@injectable()
@singleton()
export class PageService implements Service {
  constructor(private readonly mongo: MongoService) {}
  public async organizePages(bookId: string): Promise<PageData[]> {
    const pages = await this.mongo.page.findMany({
      where: {
        book_id: bookId,
      },
      orderBy: [{ index: 'asc' }],
    })

    const bookMap = new Map()
    const topLevelBooks: PageData[] = []

    pages
      .map((page) => ({ ...page, childrens: [] }))
      .forEach((page) => {
        if (page.parent_id === null) {
          topLevelBooks.push(page)
        } else {
          if (!bookMap.has(page.parent_id)) {
            bookMap.set(page.parent_id, [])
          }
          bookMap.get(page.parent_id).push(page)
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

export type PageData = {
  childrens?: Page[]
} & Page
