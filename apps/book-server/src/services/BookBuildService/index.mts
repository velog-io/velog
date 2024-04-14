import path from 'path'
import fs from 'fs-extra'
import { exec as execCb } from 'child_process'
import { promisify } from 'util'
import { NotFoundError } from '@errors/NotfoundError.mjs'
import { MongoService } from '@lib/mongo/MongoService.mjs'
import { injectable, singleton } from 'tsyringe'
import { ConfilctError } from '@errors/ConfilctError.mjs'
import { PageData, PageService } from '../PageService/index.mjs'
import { indexJSXTemplate } from '@templates/indexJSXTemplate.js'
import { themeConfigTemplate } from '@templates/themeConfigTemplate.js'
import { urlAlphabet, random, customRandom } from 'nanoid'
import { MqService } from '@lib/mq/MqService.mjs'
import { nextConfigTempate } from '@templates/nextConfigTemplate.js'
import { EnvService } from '@lib/env/EnvService.mjs'

const exec = promisify(execCb)

interface Service {
  build(bookId: string): Promise<void>
}

@injectable()
@singleton()
export class BookBuildService implements Service {
  constructor(
    private readonly mongo: MongoService,
    private readonly mq: MqService,
    private readonly env: EnvService,
    private readonly pageService: PageService,
  ) {}
  public async build(bookId: string): Promise<void> {
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
      fs.rmSync(dest, { recursive: true, force: true })
      throw new ConfilctError('Build process already in progress for this book')
    }
    // Create folder
    fs.mkdirSync(dest)

    // COPY base file to target folder
    const src = path.resolve(process.cwd(), 'books/base')
    await fs.copy(src, dest, { dereference: true })

    // nextra install
    const installStdout = await this.installDependencies(dest)

    if (installStdout) {
      this.mq.publish({
        topicParameter: bookId,
        payload: {
          bookBuildInstalled: {
            message: installStdout,
          },
        },
      })
    }

    // json to files
    const pages = await this.pageService.organizePages(bookId)

    // create meta.json
    const pagesPath = `${dest}/pages`
    const metaData = await this.writeMetaJson(pages, pagesPath)

    fs.writeFileSync(
      `${dest}/next.config.mjs`,
      nextConfigTempate({ bucketUrl: this.env.get('bookBucketUrl'), bookId }),
    )
    fs.writeFileSync(`${dest}/theme.config.tsx`, themeConfigTemplate({ title: book.title }))
    fs.writeFileSync(`${pagesPath}/index.jsx`, indexJSXTemplate(metaData[0].key))

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
  private async installDependencies(dest: string) {
    try {
      const { stdout, stderr } = await exec('pnpm i next', { cwd: dest })
      if (stderr) {
        console.error(`stderr: ${stderr}`)
      }
      return stdout
    } catch (error) {
      console.error(`exec error: ${error}`)
    }
  }
  private async buildTsToJs(dest: string) {
    try {
      const { stdout, stderr } = await exec('pnpm build', { cwd: dest })
      if (stderr) {
        console.error(`stderr: ${stderr}`)
      }
      return stdout
    } catch (error) {
      console.error(`exec error: ${error}`)
    }
  }
  private async writeMetaJson(book: BookResult[], baseDest: string) {
    const books = this.insertKey(book)
    const meta = books.reduce(
      (acc, page) => {
        const key = page.key
        acc[key] = page.title
        return acc
      },
      {} as Record<string, string>,
    )

    fs.writeFileSync(`${baseDest}/_meta.json`, JSON.stringify(meta, null, 2))

    const promises = books.map((page) => {
      const mdxTarget = path.resolve(baseDest, `${page.key}.mdx`)
      fs.writeFileSync(mdxTarget, page.body)

      if (page.childrens.length > 0) {
        const folderPath = page.key
        const targetPath = `${baseDest}/${folderPath}`
        fs.mkdirSync(targetPath)
        return this.writeMetaJson(page.childrens, targetPath)
      }
    })

    await Promise.all(promises)
    return books
  }
  private insertKey = (book: BookResult[]) => {
    return book.map((page) => ({
      key: `${page.title}_${customRandom(urlAlphabet, 10, random)().toLocaleLowerCase()}`.replace(
        /[^a-zA-Z0-9-_]/g,
        '_',
      ),
      ...page,
    }))
  }
}

type BookResult = PageData
