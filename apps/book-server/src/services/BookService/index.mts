import { NotFoundError } from '@errors/NotFoundError.mjs'
import { MongoService } from '@lib/mongo/MongoService.mjs'
import { injectable, singleton } from 'tsyringe'
import { BadRequestError } from '@errors/BadRequestErrors.mjs'
import { ConfilctError } from '@errors/ConfilctError.mjs'
import { Book } from '@packages/database/velog-book-mongo'
import { IsDeployInput } from '@graphql/generated.js'
import { UnauthorizedError } from '@errors/UnauthorizedError.mjs'
import { RedisService } from '@lib/redis/RedisService.mjs'
import { WriterService } from '@services/WriterService/index.mjs'

interface Service {
  findById(bookId: string): Promise<Book | null>
  findByUrlSlug(urlSlug: string): Promise<Book | null>
  getBook(bookId: string, signedUserId?: string): Promise<Book>
  isDeploy(input: IsDeployInput, signedUserId?: string): Promise<boolean>
}

@injectable()
@singleton()
export class BookService implements Service {
  constructor(
    private readonly mongo: MongoService,
    private readonly redis: RedisService,
    private readonly writerService: WriterService,
  ) {}
  public async findById(bookId: string): Promise<Book | null> {
    return await this.mongo.book.findUnique({
      where: {
        id: bookId,
      },
    })
  }
  public async findByUrlSlug(urlSlug: string): Promise<Book | null> {
    return await this.mongo.book.findUnique({
      where: {
        url_slug: urlSlug,
      },
    })
  }
  public async getBook(bookId: string, signedUserId?: string): Promise<Book> {
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

    if (!book.is_published && book.fk_writer_id !== signedUserId) {
      throw new ConfilctError('Not owner of book')
    }

    return book
  }

  public async isDeploy(input: IsDeployInput, signedWriterId?: string): Promise<boolean> {
    if (!signedWriterId) {
      throw new UnauthorizedError('Not logged in')
    }

    const writer = await this.writerService.findById(signedWriterId)

    if (!writer) {
      throw new NotFoundError('Not found writer')
    }

    const { book_url_slug } = input

    const book = await this.findByUrlSlug(book_url_slug)

    if (!book) {
      throw new NotFoundError('Not found book')
    }

    if (book.fk_writer_id !== writer.id) {
      throw new ConfilctError('Not owner of book')
    }

    const buildKey = this.redis.generateKey.buildBook(book.id)
    const deployKey = this.redis.generateKey.deployBook(book.id)

    const buildResult = await this.redis.exists(buildKey)
    const deployResult = await this.redis.exists(deployKey)

    const isDeploy = [buildResult, deployResult].some((v) => v === 1)
    return isDeploy
  }
}
