import path from 'node:path'
import fs from 'fs-extra'
import { injectable, singleton } from 'tsyringe'
import { BookService } from '@services/BookService/index.mjs'
import { NotFoundError } from '@errors/NotFoundError.mjs'
import { WriterService } from '@services/WriterService/index.mjs'
import { AwsS3Service } from '@lib/awsS3/AwsS3Service.mjs'
import mime from 'mime'
import { ENV } from '@env'
import { UnauthorizedError } from '@errors/UnauthorizedError.mjs'
import { ConfilctError } from '@errors/ConfilctError.mjs'
import { DeployResult } from '@graphql/generated.js'
import { MongoService } from '@lib/mongo/MongoService.mjs'
import { RedisService } from '@lib/redis/RedisService.mjs'

interface Service {
  deploy: (bookId: string, signedWriterId?: string) => Promise<DeployResult>
}
@injectable()
@singleton()
export class BookDeployService implements Service {
  constructor(
    private readonly mongo: MongoService,
    private readonly awsS3: AwsS3Service,
    private readonly redis: RedisService,
    private readonly writerService: WriterService,
    private readonly bookService: BookService,
  ) {}
  async deploy(url_slug: string, signedWriterId?: string): Promise<DeployResult> {
    if (!signedWriterId) {
      throw new UnauthorizedError('Not logged in')
    }

    const writer = await this.writerService.findById(signedWriterId)

    if (!writer) {
      console.log('Not found writer')
      throw new NotFoundError('Not found writer')
    }

    const book = await this.bookService.findByUrlSlug(url_slug)

    if (!book) {
      console.log('Not found book')
      throw new NotFoundError('Not found book')
    }

    if (book.fk_writer_id !== writer.id) {
      throw new ConfilctError('Not owner of book')
    }

    const deployKey = this.redis.generateKey.deployBook(book.id)
    const isDeploying = await this.redis.exists(deployKey)

    if (isDeploying) {
      return {
        published_url: null,
        message: 'Already deploying',
      }
    }

    try {
      const output = path.resolve(process.cwd(), 'books', book.id, 'out')

      // find output
      const exists = fs.existsSync(output)
      if (!exists) {
        console.log('Not found book output')
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
      const baseUrl = `${book.url_slug}`.replace('/', '')

      const promises = targetFiles.map(async (filePath) => {
        const body = fs.readFileSync(filePath)
        let relativePath = filePath.replace(output, '')
        const ext = path.extname(relativePath)
        if (ext === '.html' && !relativePath.includes('index.html')) {
          relativePath = relativePath.replace('.html', '')
        }
        const key = `${baseUrl}/${book.deploy_code}${relativePath}`
        const contentType = mime.getType(filePath)
        await this.awsS3.uploadFile({
          bucketName: ENV.bookBucketName,
          key,
          body: body,
          ContentType: contentType ?? 'application/octet-stream',
          ACL: 'public-read',
        })
      })

      await Promise.all(promises)
      const published_url = `https://books.velog.io/${baseUrl}/${book.deploy_code}`

      setImmediate(async () => {
        await this.mongo.book.update({
          where: {
            id: book.id,
          },
          data: {
            published_url,
          },
        })
      })

      return {
        published_url,
      }
    } catch (error) {
      console.error(error)
      return {
        published_url: null,
      }
    } finally {
      await this.redis.del(deployKey)
    }
  }
}
