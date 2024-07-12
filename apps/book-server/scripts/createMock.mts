import 'reflect-metadata'
import { MongoService } from '@lib/mongo/MongoService.mjs'
import { getMockPages } from 'test/mock/mockBook.mjs'
import { Writer } from '@packages/database/velog-book-mongo'
import { faker } from '@faker-js/faker'
import { UtilsService } from '@lib/utils/UtilsService.mjs'
import { PageService } from '@services/PageService/index.mjs'
import { BookService } from '@services/BookService/index.mjs'
import { RedisService } from '@lib/redis/RedisService.mjs'
import { WriterService } from '@services/WriterService/index.mjs'
import { JwtService } from '@lib/jwt/JwtService.mjs'

class Seeder {
  constructor(
    private readonly mongo: MongoService,
    private readonly utils: UtilsService,
    private readonly pageService: PageService,
  ) {}
  async createWriter() {
    const exists = await this.mongo.writer.findFirst({})

    if (exists) {
      return exists
    }

    const username = 'test_carrick'
    return this.mongo.writer.create({
      data: {
        fk_user_id: '6152b185-2efb-4d79-88f9-b9cfa96cbb9a',
        username,
        email: 'test@velog.com',
        short_bio: 'Hello, I am test writer',
        display_name: 'carrick',
        thumbnail: faker.image.dataUri(),
      },
    })
  }

  public async createBook(writer: Writer) {
    const mockPages = getMockPages(100).map((page) => ({
      ...page,
      fk_writer_id: writer.id,
    }))

    const title = 'Learning bunJS is Fun!'
    const escpaedTitle = this.utils.escapeForUrl(title).toLowerCase()
    const url_slug = `/@${writer.username}/${escpaedTitle}`

    const book = await this.mongo.book.create({
      data: {
        fk_writer_id: writer.id,
        title: title,
        thumbnail: faker.image.dataUri(),
        description: faker.lorem.paragraph(2),
        url_slug,
        pages: {
          createMany: {
            data: mockPages,
          },
        },
      },
    })

    const pages = await this.mongo.page.findMany({
      where: {
        fk_book_id: book.id,
      },
    })
    const topLevel = pages
      .slice(0, 10)
      .filter((_, index) => index !== 0 && index !== 2 && index !== 6)

    const secondLevel = pages.slice(10, 50)

    for (let i = 11; i < 51; i++) {
      const parentId = topLevel[Math.floor(Math.random() * topLevel.length)].id
      const selected = pages[i]

      await this.mongo.page.update({
        where: {
          id: selected.id,
        },
        data: {
          parent_id: parentId,
          depth: 2,
        },
      })

      await this.mongo.page.update({
        where: {
          id: parentId,
        },
        data: {
          type: 'folder',
        },
      })
    }

    for (let i = 51; i < 101; i++) {
      const parentId = secondLevel[Math.floor(Math.random() * secondLevel.length)].id
      const selected = pages[i]

      if (!selected) {
        continue
      }

      await this.mongo.page.update({
        where: {
          id: selected.id,
        },
        data: {
          parent_id: parentId,
          depth: 3,
        },
      })

      await this.mongo.page.update({
        where: {
          id: parentId,
        },
        data: {
          type: 'folder',
        },
      })
    }

    const targetUrlSlugUpdatePage = await this.mongo.page.findMany({
      where: {
        parent_id: null,
        type: 'folder',
      },
    })

    for (const topLevelPage of targetUrlSlugUpdatePage) {
      await this.pageService.updatePageAndChildrenUrlSlug({
        pageId: topLevelPage.id,
        signedWriterId: writer.id,
      })
    }
  }
}

const main = async () => {
  const mongo = new MongoService()
  const utils = new UtilsService()
  const redis = new RedisService()
  const jwt = new JwtService()

  const writerService = new WriterService(jwt, mongo, redis)
  const bookService = new BookService(mongo, redis, writerService)
  const pageService = new PageService(mongo, utils, bookService)
  const seeder = new Seeder(mongo, utils, pageService)

  try {
    const writer = await seeder.createWriter()
    await seeder.createBook(writer)
  } catch (error) {
    console.log('create mock error:', error)
  }
}

function checkAppEnv() {
  if (process.env.NODE_ENV !== 'development') {
    throw Error('Only Allow development environment')
  }
}

function checkDatabaseUrl() {
  if (!process.env.MONGO_URL) {
    throw new Error('Not found mongo url env')
  }

  if (!process.env.MONGO_URL.includes('localhost')) {
    throw new Error('Database host must be localhost')
  }
}

checkAppEnv()
checkDatabaseUrl()
await main()
