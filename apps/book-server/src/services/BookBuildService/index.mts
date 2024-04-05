import { Book } from '@packages/database/velog-book-mongo'
import { injectable, singleton } from 'tsyringe'

interface Service {
  build(book: Book): Promise<void>
}

@injectable()
@singleton()
export class BookBuildService implements Service {
  async build(book: Book): Promise<void> {
    console.log(`Building book: ${book.id}`)
  }
}
