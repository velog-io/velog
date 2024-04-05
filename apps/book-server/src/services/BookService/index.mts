import { NotFoundError } from '@errors/NotfoundError.mjs'
import { MongoService } from '@lib/mongo/MongoService.mjs'
import { injectable, singleton } from 'tsyringe'
import { BadRequestError } from '@errors/BadRequestErrors.mjs'
import { ConfilctError } from '@errors/ConfilctError.mjs'
import { Book } from '@packages/database/velog-book-mongo'

interface Service {
  findById(bookId: string): Promise<Book | null>
  getBook(bookId: string, signedUserId?: string): Promise<Book>
}

@injectable()
@singleton()
export class BookService implements Service {
  constructor(private readonly mongo: MongoService) {}
  public async findById(bookId: string): Promise<Book | null> {
    return await this.mongo.book.findUnique({
      where: {
        id: bookId,
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

    if (!book.is_published && book.writer_id !== signedUserId) {
      throw new ConfilctError('Not owner of book')
    }

    return book
  }
}
