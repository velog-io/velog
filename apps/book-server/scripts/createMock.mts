import 'reflect-metadata'
import { MongoService } from '@lib/mongo/MongoService.mjs'
import { getMockPages } from 'test/mock/mockBook.mjs'
import { Writer } from '@packages/database/velog-book-mongo'
import { faker } from '@faker-js/faker'
import { urlAlphabet, random, customRandom } from 'nanoid'

class Seeder {
  constructor(private readonly mongo: MongoService) {}
  async createWriter() {
    const exists = await this.mongo.writer.findFirst({})

    if (exists) {
      return exists
    }

    return this.mongo.writer.create({
      data: {
        fk_user_id: '6152b185-2efb-4d79-88f9-b9cfa96cbb9a',
        pen_name: 'test',
        email: 'test@velog.com',
        short_bio: 'Hello, I am test writer',
      },
    })
  }

  private escapeForUrl(text: string): string {
    return text
      .replace(
        /[^0-9a-zA-Zㄱ-힣.\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf -]/g,
        '',
      )
      .trim()
      .replace(/ /g, '-')
      .replace(/--+/g, '-')
      .replace(/\.+$/, '')
  }
  public async createBook(writer: Writer) {
    const mockPages = getMockPages(100).map((page) => ({
      writer_id: writer.id,
      ...page,
    }))

    const title = 'Learning bunJS is Fun!'
    const urlSlug = `${title}-${customRandom(urlAlphabet, 10, random)().toLocaleLowerCase()}`

    const book = await this.mongo.book.create({
      data: {
        writer_id: writer.id,
        title: title,
        thumbnail: faker.image.dataUri(),
        description: faker.lorem.paragraph(2),
        is_temp: false,
        is_private: false,
        is_published: true,
        url_slug: this.escapeForUrl(urlSlug),
        pages: {
          createMany: {
            data: mockPages,
          },
        },
      },
    })

    const pages = await this.mongo.page.findMany({
      where: {
        book_id: book.id,
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
        },
      })
    }
  }
}

const main = async () => {
  const mongo = new MongoService()
  const seeder = new Seeder(mongo)

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
