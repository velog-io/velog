import { NotFoundError } from '@errors/NotfoundError.mjs'
import { MongoService } from '@lib/mongo/MongoService.mjs'
import { injectable, singleton } from 'tsyringe'
import path from 'path'
import { ConfilctError } from '@errors/ConfilctError.mjs'
import fs from 'fs-extra'
import { exec } from 'child_process'

interface Service {
  build(bookId: string): Promise<void>
}

@injectable()
@singleton()
export class BookBuildService implements Service {
  constructor(private readonly mongo: MongoService) {}
  async build(bookId: string): Promise<void> {
    //TODO: ADD authentication
    const book = await this.mongo.book.findUnique({
      where: { id: bookId },
    })

    if (!book) {
      throw new NotFoundError('Book not found')
    }

    // create folder
    const dest = path.resolve(process.cwd(), 'books', bookId)

    // TODO: ADD handle cache from s3

    const exists = fs.existsSync(dest)
    if (exists) {
      throw new ConfilctError('Build process already in progress for this book')
    }
    // Create folder
    fs.mkdirSync(dest)

    // COPY base file to target folder
    const src = path.resolve(process.cwd(), 'books/base')
    await fs.copy(src, dest, { dereference: true })

    //nextra install
    exec('pnpm i', { cwd: dest }, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`)
        return
      }
      console.log(`stdout: ${stdout}`)
      console.error(`stderr: ${stderr}`)
    })

    // json to files
  }
}
