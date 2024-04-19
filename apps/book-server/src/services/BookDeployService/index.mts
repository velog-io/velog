import path from 'path'
import fs from 'fs-extra'
import { injectable, singleton } from 'tsyringe'
import { BookService } from '@services/BookService/index.mjs'
import { NotFoundError } from '@errors/NotfoundError.mjs'
import { WriterService } from '../WriterService/index.mjs'
import { AwsS3Service } from '@lib/awsS3/AwsS3Service.mjs'
import { EnvService } from '@lib/env/EnvService.mjs'
import mime from 'mime'

interface Service {
  deploy: (bookId: string) => Promise<void>
}

@injectable()
@singleton()
export class BookDeployService implements Service {
  constructor(
    private readonly env: EnvService,
    private readonly awsS3: AwsS3Service,
    private readonly writerService: WriterService,
    private readonly bookService: BookService,
  ) {}
  async deploy(bookId: string): Promise<void> {
    // TODO: add authentification
    // if (!signedUserId) {
    //   throw new UnauthorizedError('Not logged in')
    // }

    // const writer = await this.writerService.findById(signedUserId)

    // if (!writer) {
    //   throw new NotFoundError('Not found writer')
    // }

    const book = await this.bookService.findById(bookId)

    if (!book) {
      throw new NotFoundError('Not found book')
    }

    // if (book.writer_id !== writer.id) {
    //   throw new ConfilctError('Not owner of book')
    // }

    const output = path.resolve(process.cwd(), 'books', bookId, 'out')

    // find output
    const exists = fs.existsSync(output)
    if (!exists) {
      throw new NotFoundError('Not found book output')
    }

    const files = await fs.readdir(output, { recursive: true, encoding: 'utf8' })
    const targetFiles: string[] = files
      .map((file) => {
        const filePath = path.join(output, file)
        const stat = fs.statSync(filePath)
        return stat.isFile() ? filePath : ''
      })
      .filter(Boolean)

    // upload to S3
    const promises = targetFiles.map(async (filePath) => {
      const body = fs.readFileSync(filePath)
      let relativePath = filePath.replace(output, '')
      const ext = path.extname(relativePath)
      if (ext === '.html' && !relativePath.includes('index.html')) {
        relativePath = relativePath.replace('.html', '')
      }
      const contentType = mime.getType(filePath)
      await this.awsS3.uploadFile({
        bucketName: this.env.get('bookBucketName'),
        key: `${bookId}${relativePath}`,
        body: body,
        ContentType: contentType ?? 'application/octet-stream',
        ACL: 'public-read',
      })
    })

    try {
      await Promise.all(promises)

      console.log(`Deployed URL: , ${this.env.get('bookBucketUrl')}/${bookId}/index.html`)
    } catch (error) {
      console.error(error)
    }
  }
}
