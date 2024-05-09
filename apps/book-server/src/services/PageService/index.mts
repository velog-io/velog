import { ConfilctError } from '@errors/ConfilctError.mjs'
import { NotFoundError } from '@errors/NotfoundError.mjs'
import { UnauthorizedError } from '@errors/UnauthorizedError.mjs'

import { MongoService } from '@lib/mongo/MongoService.mjs'
import { UtilsService } from '@lib/utils/UtilsService.mjs'
import { Page } from '@packages/database/velog-book-mongo'
import { BookService } from '@services/BookService/index.mjs'
import { injectable, singleton } from 'tsyringe'

interface Service {
  updatePageAndChildrenUrlSlug(args: UpdatePageAndChildrenUrlSlugArgs): Promise<void>
}

@injectable()
@singleton()
export class PageService implements Service {
  constructor(
    private readonly mongo: MongoService,
    private readonly utils: UtilsService,
    private readonly bookSerivce: BookService,
  ) {}
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

  public async getPages(bookUrlSlug: string, signedWriterId?: string): Promise<Page[]> {
    if (!signedWriterId) {
      throw new UnauthorizedError('Not authorized')
    }

    const book = await this.bookSerivce.findByUrlSlug(bookUrlSlug)

    if (!book) {
      throw new NotFoundError('Not found book')
    }

    if (book.writer_id !== signedWriterId) {
      throw new ConfilctError('Not owner of book')
    }

    const pages = await this.mongo.page.findMany({
      where: {
        book_id: book.id,
      },
      include: {
        childrens: {
          include: {
            childrens: {
              include: {
                childrens: true,
              },
            },
          },
        },
      },
      orderBy: [{ index: 'asc' }],
    })

    return pages
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
