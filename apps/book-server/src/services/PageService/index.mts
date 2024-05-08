import { NotFoundError } from '@errors/NotfoundError.mjs'
import { UnauthorizedError } from '@errors/UnauthorizedError.mjs'
import { MongoService } from '@lib/mongo/MongoService.mjs'
import { UtilsService } from '@lib/utils/UtilsService.mjs'
import { Page } from '@packages/database/velog-book-mongo'
import { injectable, singleton } from 'tsyringe'

interface Service {
  organizePages(bookId: string): Promise<Page[]>
  updatePageAndChildrenUrlSlug(args: UpdatePageAndChildrenUrlSlugArgs): Promise<void>
}

@injectable()
@singleton()
export class PageService implements Service {
  constructor(private readonly mongo: MongoService, private readonly utils: UtilsService) {}
  public async organizePages(bookId: string): Promise<Page[]> {
    const pages = await this.mongo.page.findMany({
      where: {
        book_id: bookId,
      },
      include: {
        childrens: true,
      },
      orderBy: [{ index: 'asc' }],
    })

    // const bookMap = new Map()
    // const topLevelBooks: Page[] = []

    // pages.forEach((page) => {
    //   if (page.parent_id === null) {
    //     topLevelBooks.push(page)
    //   } else {
    //     if (!bookMap.has(page.parent_id)) {
    //       bookMap.set(page.parent_id, [])
    //     }
    //     bookMap.get(page.parent_id).push(page)
    //   }
    // })

    // function buildHierarchy(page: Page) {
    //   if (bookMap.has(page.id)) {
    //     page.childrens = bookMap.get(page.id)
    //     page.childrens?.forEach(buildHierarchy)
    //   }
    // }

    // topLevelBooks.forEach(buildHierarchy)
    return pages
  }
  public async updatePageAndChildrenUrlSlug({
    pageId,
    signedWriterId,
    urlPrefix = '',
  }: UpdatePageAndChildrenUrlSlugArgs) {
    if (!signedWriterId) {
      throw new UnauthorizedError('Unauthorized')
    }

    const page = await this.mongo.page.findUnique({
      where: {
        id: pageId,
      },
    })

    if (!page) {
      throw new NotFoundError('Page not found')
    }

    if (urlPrefix === '') {
      const book = await this.mongo.book.findUnique({
        where: {
          id: page.book_id,
        },
      })

      if (!book) {
        throw new NotFoundError('Book not found')
      }

      if (book.writer_id !== signedWriterId) {
        throw new UnauthorizedError('Book is not yours')
      }
    }

    const escapedTitle = `${urlPrefix}/${this.utils.escapeForUrl(page.title).toLowerCase()}`
    const newUrlSlug = `${escapedTitle}-${page.code}`
    await this.mongo.page.update({
      where: {
        id: page.id,
      },
      data: {
        url_slug: newUrlSlug,
      },
    })

    const childrens = await this.mongo.page.findMany({
      where: {
        parent_id: pageId,
      },
    })

    for (const child of childrens) {
      await this.updatePageAndChildrenUrlSlug({
        pageId: child.id,
        signedWriterId,
        urlPrefix: `${escapedTitle}`,
      })
    }
  }
}

export type PageData = {
  childrens: Page[]
} & Page

type UpdatePageAndChildrenUrlSlugArgs = {
  pageId: string
  signedWriterId?: string
  urlPrefix?: string
}
