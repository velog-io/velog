import { NotFoundError } from '@errors/NotfoundError.mjs'
import { MongoService } from '@lib/mongo/MongoService.mjs'
import { injectable, singleton } from 'tsyringe'
import path from 'path'
import { ConfilctError } from '@errors/ConfilctError.mjs'
import fs from 'fs-extra'
import { PageData, PageService } from '../PageService/index.mjs'
import { exec as execCb } from 'child_process'
import { promisify } from 'util'
import { Page } from '@graphql/generated.js'
import { indexJSXTemplate } from '@templates/indexJSXTemplate.js'
import { themeConfigTemplate } from '@templates/themeConfigTemplate.js'
import { urlAlphabet, random, customRandom } from 'nanoid'
import { PubSub } from 'mercurius'
import { MqService } from '@lib/mq/MqService.mjs'

const exec = promisify(execCb)

interface Service {
  build(bookId: string, pubsub: PubSub): Promise<void>
}

@injectable()
@singleton()
export class BookBuildService implements Service {
  constructor(
    private readonly mongo: MongoService,
    private readonly mq: MqService,
    private readonly pageService: PageService,
  ) {}
  public async build(bookId: string, pubsub: PubSub): Promise<void> {
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
    const stdout = await this.installDependencies(dest)
    const generateTopic = this.mq.generateTopic('build')
    const installTopic = generateTopic.installed(bookId)

    pubsub.publish({
      topic: installTopic,
      payload: {
        bookBuildInstalled: {
          message: stdout,
        },
      },
    })

    // json to files
    const pages = await this.pageService.organizePages(bookId)

    // create meta.json
    const pagesPath = `${dest}/pages`
    await this.writeMetaJson(pages, pagesPath)

    fs.writeFileSync(`${dest}/theme.config.tsx`, themeConfigTemplate({ title: book.title }))
    fs.writeFileSync(`${pagesPath}/index.jsx`, indexJSXTemplate(this.generateKey(pages[0])))

    await exec('pnpm prettier -w .', { cwd: dest })

    const completedTopic = generateTopic.completed(bookId)
    pubsub.publish({
      topic: completedTopic,
      payload: {
        bookBuildCompleted: {
          message: 'completed',
        },
      },
    })
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
  private generateKey = (page: Page) =>
    `${page.title}_${customRandom(urlAlphabet, 10, random)().toLocaleLowerCase()}`.replace(
      /[^a-zA-Z0-9-_]/g,
      '_',
    )
  private async writeMetaJson(book: BookResult[], baseDest: string, isinit = false) {
    let indexPageName = ''
    const meta = book.reduce(
      (acc, page, index) => {
        const key = this.generateKey(page)
        if (index === 0) {
          indexPageName = key
        }
        acc[key] = page.title
        return acc
      },
      {} as Record<string, string>,
    )

    fs.writeFileSync(`${baseDest}/_meta.json`, JSON.stringify(meta, null, 2))

    const promises = book.map((page, index) => {
      const mdxTarget = path.resolve(baseDest, `${this.generateKey(page)}.mdx`)
      fs.writeFileSync(mdxTarget, page.body)

      if (page.childrens.length > 0) {
        const folderPath = this.generateKey(page)
        const targetPath = `${baseDest}/${folderPath}`
        fs.mkdirSync(targetPath)
        return this.writeMetaJson(page.childrens, targetPath)
      }
    })

    await Promise.all(promises)
  }
}

type BookResult = PageData
