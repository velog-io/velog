import { BadRequestError } from '@errors/BadRequestErrors.mjs'
import { ConfilctError } from '@errors/ConfilctError.mjs'
import { NotFoundError } from '@errors/NotFoundError.mjs'
import { UnauthorizedError } from '@errors/UnauthorizedError.mjs'
import type {
  CreatePageInput,
  DeletePageInput,
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
  getPages(bookUrlSlug: string, signedWriterId?: string): Promise<PageWithChildren[]>
  getPage(input: GetPageInput, signedWriterId?: string): Promise<Page | null>
  create(input: CreatePageInput, signedWriterId?: string): Promise<Page>
  update(input: UpdatePageInput, signedWriterId?: string): Promise<Page>
  reorder(input: ReorderInput, signedWriterId?: string): Promise<void>
  delete(input: DeletePageInput, signedWriterId?: string): Promise<void>
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

  public async getPages(bookUrlSlug: string, signedWriterId?: string): Promise<PageWithChildren[]> {
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

    const fetchChildren = (depth: number): Prisma.PageInclude => {
      if (depth === 0) return {}

      return {
        childrens: {
          where: {
            is_deleted: false,
          },
          orderBy,
          include: fetchChildren(depth - 1),
        },
      }
    }

    const pages = await this.mongo.page.findMany({
      where: {
        fk_book_id: book.id,
        parent_id: null,
        is_deleted: false,
      },
      orderBy,
      include: fetchChildren(3),
    })

    return pages as any
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

    let pageUrlSlug = page_url_slug
    if (page_url_slug === '/' || !page_url_slug) {
      const initPage = await this.mongo.page.findFirst({
        where: {
          parent_id: null,
          index: 0,
        },
      })
      pageUrlSlug = initPage?.url_slug ?? page_url_slug
    }

    const page = await this.mongo.page.findFirst({
      where: {
        url_slug: pageUrlSlug,
        fk_writer_id: signedWriterId,
      },
    })

    if (!page) {
      throw new NotFoundError('Not found page')
    }

    const updateInput: Prisma.PageUpdateInput = {}

    if (typeof rest_input.body === 'string') {
      Object.assign(updateInput, { body: rest_input.body })
    }

    if (typeof rest_input.title === 'string') {
      const newUrlSlug = `/${this.utils.escapeForUrl(rest_input.title)}-${page.code}`
      Object.assign(updateInput, { title: rest_input.title, url_slug: newUrlSlug })
    }

    if (typeof rest_input.is_deleted === 'boolean') {
      Object.assign(updateInput, { is_deleted: rest_input.is_deleted })
    }

    const updatedPage = await this.mongo.page.update({
      where: {
        id: page.id,
      },
      data: {
        ...updateInput,
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

    if (parentPage && parentPage?.fk_book_id !== book.id) {
      throw new ConfilctError('Not related parent page')
    }

    if (parentPage && parentPage.type !== 'folder') {
      await this.mongo.page.update({
        where: {
          id: parentPage.id,
        },
        data: {
          type: 'folder',
        },
      })
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

    const siblings = await this.mongo.page.findMany({
      where: {
        parent_id: parentPage?.id ?? null,
        is_deleted: false,
        id: {
          not: targetPage.id,
        },
      },
      orderBy: [{ index: 'asc' }, { updated_at: 'desc' }],
    })

    const updatedSiblings = siblings.map((sibling, i) => {
      return this.mongo.page.update({
        where: {
          id: sibling.id,
        },
        data: {
          index: i < index ? i : i + 1,
        },
      })
    })

    await Promise.all(updatedSiblings)
  }

  public async delete(input: DeletePageInput, signedWriterId?: string): Promise<void> {
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

    const page = await this.mongo.page.findFirst({
      where: {
        fk_book_id: book.id,
        url_slug: page_url_slug,
        fk_writer_id: signedWriterId,
      },
    })

    if (!page) {
      throw new NotFoundError('Not found page')
    }

    if (page.is_deleted) {
      throw new BadRequestError('Already deleted')
    }

    const deletedPage = await this.mongo.page.update({
      where: {
        id: page.id,
      },
      data: {
        is_deleted: true,
        index: null,
        updated_at: new Date(),
      },
    })

    const siblings = await this.mongo.page.findMany({
      where: {
        parent_id: page.parent_id,
        is_deleted: false,
        id: {
          not: deletedPage.id,
        },
      },
      orderBy: [{ index: 'asc' }, { updated_at: 'desc' }],
    })

    const updateSiblings = siblings.map((sibling, index) => {
      return this.mongo.page.update({
        where: {
          id: sibling.id,
        },
        data: {
          index,
        },
      })
    })

    await Promise.all(updateSiblings)
  }
}

type UpdatePageAndChildrenUrlSlugArgs = {
  pageId: string
  signedWriterId?: string
  urlPrefix?: string
}

export type PageWithChildren = Prisma.PageGetPayload<{
  include: {
    childrens: {
      include: {
        childrens: {
          include: {
            childrens: true
          }
        }
      }
    }
  }
}>
