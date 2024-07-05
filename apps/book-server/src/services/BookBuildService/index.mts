import path from 'node:path'
import fs from 'fs-extra'
import { exec as execCb } from 'node:child_process'
import { promisify } from 'node:util'
import { NotFoundError } from '@errors/NotfoundError.mjs'
import { MongoService } from '@lib/mongo/MongoService.mjs'
import { injectable, singleton } from 'tsyringe'
import { ConfilctError } from '@errors/ConfilctError.mjs'
import { themeConfigTemplate } from '@templates/themeConfigTemplate.mjs'
import { MqService } from '@lib/mq/MqService.mjs'
import { nextConfigTempate } from '@templates/nextConfigTemplate.mjs'
import { UnauthorizedError } from '@errors/UnauthorizedError.mjs'
import type { Page } from '@packages/database/velog-book-mongo'
import { BookService } from '@services/BookService/index.mjs'
import { WriterService } from '@services/WriterService/index.mjs'
import { BuildResult } from '@graphql/generated.js'
import { PageService } from '@services/PageService/index.mjs'
import { UtilsService } from '@lib/utils/UtilsService.mjs'

const exec = promisify(execCb)

interface Service {
  build(bookId: string, signedWriterId?: string): Promise<BuildResult>
}

@injectable()
@singleton()
export class BookBuildService implements Service {
  constructor(
    private readonly mongo: MongoService,
    private readonly utils: UtilsService,
    private readonly mq: MqService,
    private readonly bookService: BookService,
    private readonly writerService: WriterService,
    private readonly pageService: PageService,
  ) {}
  public async build(url_slug: string, signedWriterId?: string): Promise<BuildResult> {
    if (!signedWriterId) {
      throw new UnauthorizedError('Not logged in')
    }

    const writer = await this.writerService.findById(signedWriterId)

    if (!writer) {
      throw new NotFoundError('Not found writer')
    }

    const book = await this.bookService.findByUrlSlug(url_slug)

    if (!book) {
      throw new NotFoundError('Book not found')
    }

    if (book.fk_writer_id !== writer.id) {
      throw new ConfilctError('Not owner of book')
    }

    // create deploy code
    const deployCode = this.utils.randomString(10).toLocaleLowerCase()
    await this.mongo.book.update({
      where: {
        id: book.id,
      },
      data: {
        deploy_code: deployCode,
      },
    })

    // create folder
    const dest = path.resolve(process.cwd(), 'books', book.id)

    // TODO: ADD handle cache from s3
    const pagesDir = `${dest}/pages`
    const baseExists = fs.existsSync(dest)
    if (!baseExists) {
      // Create folder
      fs.mkdirSync(dest)
      // COPY base file to target folder
      const src = path.resolve(process.cwd(), 'books/base')
      await fs.copy(src, dest, { dereference: true })

      const stdout = await this.installDependencies('npm install', dest)
      if (stdout) {
        this.mq.publish({
          topicParameter: book.id,
          payload: {
            bookBuildInstalled: {
              message: stdout,
            },
          },
        })
      }
    } else {
      fs.rmSync(pagesDir, { recursive: true, force: true })
      await this.utils.sleep(100)
      fs.mkdirSync(`${pagesDir}/.gitkeep`, { recursive: true })
      await this.utils.sleep(100)
    }

    // json to files
    const pages = await this.pageService.getPages(book.url_slug, writer.id)

    // create meta.json
    await this.writeMetaJson({
      pages: pages || [],
      baseDest: pagesDir,
      isRecursive: false,
    })

    fs.writeFileSync(
      `${dest}/next.config.mjs`,
      nextConfigTempate({
        deployCode: deployCode,
        urlSlug: book.url_slug,
      }),
    )

    fs.writeFileSync(`${dest}/theme.config.tsx`, themeConfigTemplate({ title: book.title }))

    const buildStdout = await this.buildTsToJs(dest)
    if (buildStdout) {
      this.mq.publish({
        topicParameter: book.id,
        payload: {
          bookBuildCompleted: { message: buildStdout },
        },
      })
    }

    return {
      result: true,
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

      if (page.type === 'page' || page.type === 'folder') {
        const key = page.key
        acc[key] = page.title
        return acc
      }

      if (page.type === 'separator') {
        const key = page.key
        acc[key] = {
          id: page.id,
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

      if (page.type !== 'separator' && (page as any)?.childrens?.length > 0) {
        const folderPath = page.key
        const targetPath = `${baseDest}/${folderPath}`
        fs.mkdirSync(targetPath)
        return this.writeMetaJson({
          pages: (page as any)?.childrens || [],
          baseDest: targetPath,
          isRecursive: true,
        })
      }
    })

    await Promise.all(promises)
    return pages
  }
  private insertKey = (pages: Page[]) => {
    return pages.map((page) => ({
      key: `${this.utils.escapeForUrl(page.title)}-${page.code}`.toLocaleLowerCase(),
      ...page,
    }))
  }
}

type MetaJsonSerpator = { id?: string; type: 'separator' | 'page'; title?: string }
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
