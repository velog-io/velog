import { NotFoundError } from '@errors/NotfoundError.mjs'
import { MongoService } from '@lib/mongo/MongoService.mjs'
import { injectable, singleton } from 'tsyringe'
import path from 'path'
import { ConfilctError } from '@errors/ConfilctError.mjs'
import fs from 'fs-extra'
import { PageService } from '../PageService/index.mjs'
import { exec as execCb } from 'child_process'
import { promisify } from 'util'

const exec = promisify(execCb)

interface Service {
  build(bookId: string): Promise<void>
}

@injectable()
@singleton()
export class BookBuildService implements Service {
  constructor(
    private readonly mongo: MongoService,
    private readonly pageService: PageService,
  ) {}
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
    await this.installDependencies(dest)
    // json to files
    const pages = await this.pageService.organizePages(bookId)

    console.log(pages.slice(0, 1))

    // create meta.json

    // test: remove file
    fs.rmSync(dest, { recursive: true, force: true })
  }
  private async installDependencies(dest: string) {
    try {
      const { stdout, stderr } = await exec('pnpm i', { cwd: dest })
      console.log(`stdout: ${stdout}`)
      if (stderr) {
        console.error(`stderr: ${stderr}`)
      }
    } catch (error) {
      console.error(`exec error: ${error}`)
    }
  }
}
