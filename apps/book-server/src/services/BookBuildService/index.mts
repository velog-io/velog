import path from 'path'
import fs from 'fs-extra'
import { exec as execCb } from 'child_process'
import { promisify } from 'util'
import { NotFoundError } from '@errors/NotfoundError.mjs'
import { MongoService } from '@lib/mongo/MongoService.mjs'
import { injectable, singleton } from 'tsyringe'
import { ConfilctError } from '@errors/ConfilctError.mjs'
import { PageService } from '../PageService/index.mjs'
import { themeConfigTemplate } from '@templates/themeConfigTemplate.mjs'
import { urlAlphabet, random, customRandom } from 'nanoid'
import { MqService } from '@lib/mq/MqService.mjs'
import { nextConfigTempate } from '@templates/nextConfigTemplate.mjs'
import { WriterService } from '../WriterService/index.mjs'
import { ENV } from '@env'
import { UnauthorizedError } from '@errors/UnauthorizedError.mjs'
import { Page } from '@packages/database/velog-book-mongo'

const exec = promisify(execCb)

interface Service {
  build(bookId: string, signedWriterId?: string): Promise<void>
}

@injectable()
@singleton()
export class BookBuildService implements Service {
  constructor(
    private readonly mongo: MongoService,
    private readonly mq: MqService,
    private readonly pageService: PageService,
    private readonly writerService: WriterService,
  ) {}
  public async build(bookId: string, signedWriterId?: string): Promise<void> {
    // TODO: ADD authentication
    if (!signedWriterId) {
      throw new UnauthorizedError('Not logged in')
    }

    const writer = await this.writerService.findById(signedWriterId)

    if (!writer) {
      throw new NotFoundError('Not found writer')
    }

    const book = await this.mongo.book.findUnique({
      where: { id: bookId },
    })

    if (!book) {
      throw new NotFoundError('Book not found')
    }

    if (book.writer_id !== writer.id) {
      throw new ConfilctError('Not owner of book')
    }

    // create folder
    const dest = path.resolve(process.cwd(), 'books', bookId)

    // TODO: ADD handle cache from s3

    const exists = fs.existsSync(dest)
    if (exists) {
      fs.rmSync(dest, { recursive: true, force: true })
      throw new ConfilctError('Build process already in progress for this book')
    }

    // Create folder
    fs.mkdirSync(dest)

    // COPY base file to target folder
    const src = path.resolve(process.cwd(), 'books/base')
    await fs.copy(src, dest, { dereference: true })

    const stdout = await this.installDependencies('npm install', dest)
    if (stdout) {
      this.mq.publish({
        topicParameter: bookId,
        payload: {
          bookBuildInstalled: {
            message: stdout,
          },
        },
      })
    }

    // json to files
    const bookData = await this.mongo.book.findUnique({
      where: {
        id: bookId,
      },
      include: {
        pages: {
          include: {
            childrens: {
              include: {
                childrens: {
                  include: {
                    childrens: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    // create meta.json
    const pagePathOfBook = `${dest}/pages`
    await this.writeMetaJson({
      pages: bookData?.pages || [],
      baseDest: pagePathOfBook,
      isRecursive: false,
    })

    fs.writeFileSync(
      `${dest}/next.config.mjs`,
      nextConfigTempate({
        bucketUrl: ENV.bookBucketUrl,
        username: writer.username,
        urlSlug: book.url_slug,
      }),
    )
    fs.writeFileSync(`${dest}/theme.config.tsx`, themeConfigTemplate({ title: book.title }))

    await exec('pnpm prettier -w .', { cwd: dest })
    const buildStdout = await this.buildTsToJs(dest)
    if (buildStdout) {
      this.mq.publish({
        topicParameter: bookId,
        payload: {
          bookBuildCompleted: { message: buildStdout },
        },
      })
    }
  }
  private async installDependencies(command: string, dest: string): Promise<string> {
    try {
      const { stdout, stderr } = await exec(command, { cwd: dest })
      if (stderr) {
        console.error(`stderr: ${stderr}`)
        throw new Error(stderr)
      }
      return stdout
    } catch (error) {
      throw new Error(`exec error: ${error}`)
    }
  }
  private async buildTsToJs(dest: string) {
    try {
      const { stdout, stderr } = await exec('pnpm next build', { cwd: dest })
      if (stderr) {
        console.error(`stderr: ${stderr}`)
      }
      return stdout
    } catch (error) {
      console.error(`exec error: ${error}`)
    }
  }
  private async writeMetaJson({ pages: _pages, baseDest, isRecursive }: WriteMetaJsonArgs) {
    const pages = this.insertKey(_pages)
    const meta = pages.reduce((acc, page, index) => {
      if (!isRecursive && index === 0) {
        acc['index'] = page.title
        return acc
      }

      if (page.type === 'page') {
        const key = page.key
        acc[key] = page.title
        return acc
      }

      if (page.type === 'separator') {
        const key = page.key
        acc[key] = {
          type: 'separator',
          title: page.title,
        }
        return acc
      }

      return acc
    }, {} as MetaJson)

    fs.writeFileSync(`${baseDest}/_meta.json`, JSON.stringify(meta, null, 2))

    const promises = pages.map((page, index) => {
      const filename = index === 0 && !isRecursive ? 'index' : page.key
      const mdxTarget = path.resolve(baseDest, `${filename}.mdx`)
      fs.writeFileSync(mdxTarget, page.body)

      if (page.type !== 'separator' && page.childrens?.length > 0) {
        const folderPath = page.key
        const targetPath = `${baseDest}/${folderPath}`
        fs.mkdirSync(targetPath)
        return this.writeMetaJson({
          pages: page.childrens || [],
          baseDest: targetPath,
          isRecursive: true,
        })
      }
    })

    await Promise.all(promises)
    return pages
  }
  private insertKey = (book: PageData[]) => {
    return book.map((page) => ({
      key: `${page.title}_${customRandom(urlAlphabet, 10, random)().toLocaleLowerCase()}`.replace(
        /[^a-zA-Z0-9-_]/g,
        '_',
      ),
      ...page,
    }))
  }
}

type MetaJsonSerpator = { type: 'separator'; title: string }
type MetaJsonValue = string | MetaJsonSerpator
type MetaJson = Record<string, MetaJsonValue>

type WriteMetaJsonArgs = {
  pages: PageData[]
  baseDest: string
  isRecursive: boolean
}

type PageData = {
  childrens: PageData[]
} & Page
