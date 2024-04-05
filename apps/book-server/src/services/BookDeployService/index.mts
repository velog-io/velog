import { injectable, singleton } from 'tsyringe'
import { BookService } from '../BookService/index.mjs'
import { NotFoundError } from '@errors/NotfoundError.mjs'
import { BookBuildService } from '../BookBuildService/index.mjs'
import { UnauthorizedError } from '@errors/UnauthorizedError.mjs'
import { WriterService } from '../WriterService/index.mjs'
import { ConfilctError } from '@errors/ConfilctError.mjs'

interface Service {
  deploy: (bookId: string) => Promise<void>
}

@injectable()
@singleton()
export class BookDeployService implements Service {
  constructor(
    private readonly writerService: WriterService,
    private readonly bookService: BookService,
    private readonly bookBuildService: BookBuildService,
  ) {}
  async deploy(bookId: string, signedUserId?: string): Promise<void> {
    if (!signedUserId) {
      throw new UnauthorizedError('Not logged in')
    }

    const writer = await this.writerService.findById(signedUserId)

    if (!writer) {
      throw new NotFoundError('Not found writer')
    }

    const book = await this.bookService.findById(bookId)

    if (!book) {
      throw new NotFoundError('Not found book')
    }

    if (book.writer_id !== writer.id) {
      throw new ConfilctError('Not owner of book')
    }

    await this.bookBuildService.build(book)
  }
}
