import { NotFoundError } from '@errors/NotfoundError.mjs'
import { MongoService } from '@lib/mongo/MongoService.mjs'
import { injectable, singleton } from 'tsyringe'
import { BadRequestError } from '@errors/BadRequestErrors.mjs'
import { ConfilctError } from '@errors/ConfilctError.mjs'

interface Service {}

@injectable()
@singleton()
export class BookService implements Service {
  constructor(private readonly mongo: MongoService) {}
  public async getBook(bookId: string, signedUserId?: string) {
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
