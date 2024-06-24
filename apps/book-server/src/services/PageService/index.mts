import { BadRequestError } from '@errors/BadRequestErrors.mjs'
import { ConfilctError } from '@errors/ConfilctError.mjs'
import { NotFoundError } from '@errors/NotfoundError.mjs'
import { UnauthorizedError } from '@errors/UnauthorizedError.mjs'
import type {
  CreatePageInput,
  GetPageInput,
  ReorderInput,
  UpdatePageInput,
} from '@graphql/generated.js'
import { MongoService } from '@lib/mongo/MongoService.mjs'
import { UtilsService } from '@lib/utils/UtilsService.mjs'
import { Page, Prisma } from '@packages/database/velog-book-mongo'
import { BookService } from '@services/BookService/index.mjs'
import { injectable, singleton } from 'tsyringe'

interface Service {
  updatePageAndChildrenUrlSlug(args: UpdatePageAndChildrenUrlSlugArgs): Promise<void>
  getPages(bookUrlSlug: string, signedWriterId?: string): Promise<Page[]>
  getPage(input: GetPageInput, signedWriterId?: string): Promise<Page | null>
  create(input: CreatePageInput, signedWriterId?: string): Promise<Page>
  update(input: UpdatePageInput, signedWriterId?: string): Promise<Page>
  reorder(input: ReorderInput, signedWriterId?: string): Promise<void>
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
          id: page.fk_book_id,
        },
      })

      if (!book) {
        throw new NotFoundError('Book not found')
      }

      if (book.fk_writer_id !== signedWriterId) {
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

    if (book.fk_writer_id !== signedWriterId) {
      throw new ConfilctError('Not owner of book')
    }

    const orderBy: Prisma.PageOrderByWithRelationInput[] = [{ index: 'asc' }]
    const pages = await this.mongo.page.findMany({
      where: {
        fk_book_id: book.id,
        parent_id: null,
      },
      orderBy,
      include: {
        // depth 1
        childrens: {
          orderBy,
          include: {
            // depth 2
            childrens: {
              orderBy,
              include: {
                // depth 3
                childrens: {
                  orderBy,
                },
              },
            },
          },
        },
      },
    })

    return pages
  }

  public async getPage(input: GetPageInput, signedWriterId?: string): Promise<Page | null> {
    if (!signedWriterId) {
      throw new UnauthorizedError('Not authorized')
    }

    const { book_url_slug, page_url_slug } = input

    const book = await this.bookSerivce.findByUrlSlug(book_url_slug)

    if (!book) {
      throw new NotFoundError('Not found book')
    }

    if (book.fk_writer_id !== signedWriterId) {
      throw new ConfilctError('Not owner of book')
    }

    const whereQuery: Prisma.PageWhereInput = { fk_book_id: book.id, fk_writer_id: signedWriterId }

    if (page_url_slug === '/') {
      Object.assign(whereQuery, { parent_id: null, index: 0 })
    } else {
      Object.assign(whereQuery, { url_slug: page_url_slug })
    }

    const page = await this.mongo.page.findFirst({
      where: whereQuery,
    })

    return page
  }

  public async create(input: CreatePageInput, signedWriterId?: string): Promise<Page> {
    if (!signedWriterId) {
      throw new UnauthorizedError('Not authorized')
    }

    const { book_url_slug, index, parent_url_slug, title, type } = input

    const book = await this.bookSerivce.findByUrlSlug(book_url_slug)

    if (!book) {
      throw new NotFoundError('Not found book')
    }

    if (book.fk_writer_id !== signedWriterId) {
      throw new ConfilctError('Not owner of book')
    }

    let parentPage: Page | null = null

    if (parent_url_slug !== '') {
      parentPage = await this.mongo.page.findUnique({
        where: {
          url_slug: parent_url_slug,
        },
      })

      if (!parentPage) {
        throw new NotFoundError('Not found parent page')
      }
    }

    const code = this.utils.randomString(8)
    const urlSlug = this.generateUrlSlug({ parent_url_slug, title, code })

    const page = await this.mongo.page.create({
      data: {
        title,
        url_slug: urlSlug,
        index,
        code,
        body: '',
        fk_writer_id: signedWriterId,
        fk_book_id: book.id,
        type,
        depth: Math.min(3, parentPage ? parentPage.depth + 1 : 1), // max level 3
        parent_id: parentPage ? parentPage!.id : null,
      },
    })

    return page
  }
  private generateUrlSlug({ parent_url_slug, title, code }: Record<string, string>) {
    return `${this.utils.removeCodeFromUrlSlug(parent_url_slug)}/${this.utils.escapeForUrl(title).toLowerCase()}-${code}`
  }

  public async update(input: UpdatePageInput, signedWriterId?: string): Promise<Page> {
    if (!signedWriterId) {
      throw new UnauthorizedError('Not authorized')
    }

    const { book_url_slug, page_url_slug, ...rest_input } = input

    if (Object.values(rest_input).every((value) => typeof value === 'undefined')) {
      throw new BadRequestError('No input')
    }

    const book = await this.bookSerivce.findByUrlSlug(book_url_slug)

    if (!book) {
      throw new NotFoundError('Not found book')
    }

    if (book.fk_writer_id !== signedWriterId) {
      throw new ConfilctError('Not owner of book')
    }

    const page = await this.mongo.page.findFirst({
      where: {
        url_slug: page_url_slug,
        fk_writer_id: signedWriterId,
      },
    })

    if (!page) {
      throw new NotFoundError('Not found page')
    }

    const whereQuery: Prisma.PageUpdateInput = {}

    if (typeof rest_input.body === 'string') {
      Object.assign(whereQuery, { body: rest_input.body })
    }

    if (typeof rest_input.title === 'string') {
      Object.assign(whereQuery, { title: rest_input.title })
    }

    if (typeof rest_input.is_deleted === 'boolean') {
      Object.assign(whereQuery, { is_deleted: rest_input.is_deleted })
    }

    const updatedPage = await this.mongo.page.update({
      where: {
        id: page.id,
      },
      data: {
        ...whereQuery,
        updated_at: new Date(),
      },
    })

    return updatedPage
  }

  public async reorder(input: ReorderInput, signedWriterId?: string): Promise<void> {
    if (!signedWriterId) {
      throw new UnauthorizedError('Not authorized')
    }

    const { book_url_slug, target_url_slug, parent_url_slug, index } = input

    const book = await this.bookSerivce.findByUrlSlug(book_url_slug)

    if (!book) {
      throw new NotFoundError('Not found book')
    }

    if (book.fk_writer_id !== signedWriterId) {
      throw new ConfilctError('Not owner of book')
    }

    const page = await this.mongo.page.findUnique({
      where: {
        url_slug: target_url_slug,
      },
    })

    if (!page) {
      throw new NotFoundError('Not found page')
    }

    if (page.fk_book_id !== book.id) {
      throw new ConfilctError('Not related page')
    }

    const parentPage = parent_url_slug
      ? await this.mongo.page.findUnique({
          where: {
            url_slug: parent_url_slug,
          },
        })
      : null

    if (parentPage && parentPage.fk_book_id !== book.id) {
      throw new ConfilctError('Not related parent page')
    }

    const targetPage = await this.mongo.page.update({
      where: {
        id: page.id,
      },
      data: {
        parent_id: parentPage?.id || null,
        index,
        updated_at: new Date(),
      },
    })

    const childrens = await this.mongo.page.findMany({
      where: {
        parent_id: parentPage?.id ?? null,
        id: {
          not: targetPage.id,
        },
      },
      orderBy: [{ index: 'asc' }, { updated_at: 'desc' }],
    })

    const updatedChildrens = childrens.map((child, i) => {
      return this.mongo.page.update({
        where: {
          id: child.id,
        },
        data: {
          index: i < index ? i : i + 1,
        },
      })
    })

    await Promise.all(updatedChildrens)
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
