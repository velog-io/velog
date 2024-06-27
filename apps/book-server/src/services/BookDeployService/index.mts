import path from 'node:path'
import fs from 'fs-extra'
import { injectable, singleton } from 'tsyringe'
import { BookService } from '@services/BookService/index.mjs'
import { NotFoundError } from '@errors/NotfoundError.mjs'
import { WriterService } from '@services/WriterService/index.mjs'
import { AwsS3Service } from '@lib/awsS3/AwsS3Service.mjs'
import mime from 'mime'
import { ENV } from '@env'
import { UnauthorizedError } from '@errors/UnauthorizedError.mjs'
import { ConfilctError } from '@errors/ConfilctError.mjs'
import { DeployResult } from '@graphql/generated.js'

interface Service {
  deploy: (bookId: string, signedWriterId?: string) => Promise<DeployResult>
}
@injectable()
@singleton()
export class BookDeployService implements Service {
  constructor(
    private readonly awsS3: AwsS3Service,
    private readonly writerService: WriterService,
    private readonly bookService: BookService,
  ) {}
  async deploy(url_slug: string, signedWriterId?: string): Promise<DeployResult> {
    if (!signedWriterId) {
      throw new UnauthorizedError('Not logged in')
    }

    const writer = await this.writerService.findById(signedWriterId)

    if (!writer) {
      throw new NotFoundError('Not found writer')
    }

    const book = await this.bookService.findByUrlSlug(url_slug)

    if (!book) {
      throw new NotFoundError('Not found book')
    }

    if (book.fk_writer_id !== writer.id) {
      throw new ConfilctError('Not owner of book')
    }

    const output = path.resolve(process.cwd(), 'books', book.id, 'out')

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
        bucketName: ENV.bookBucketName,
        key: `@${writer.username}/${book.url_slug}${relativePath}`,
        body: body,
        ContentType: contentType ?? 'application/octet-stream',
        ACL: 'public-read',
      })
    })

    try {
      await Promise.all(promises)
      const published_url = `https://books.velog.io/@${writer.username}/${book.url_slug}/index.html`

      console.log(`Deployed URL: , ${published_url}`)

      return {
        published_url,
      }
    } catch (error) {
      console.error(error)
      return {
        published_url: null,
      }
    }
  }
}
