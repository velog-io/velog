import type { DocsThemeConfig, PageMapItem, PageOpts } from '@packages/nextra-editor'
import fs from 'node:fs'
import path from 'node:path'
import { escapeForUrl } from './utils'

type Pages = Page[]
type Page = {
  title: string
  url_slug: string
  type: string
  parent_id: string | null
  code: string
  childrens: Page[]
}

type Args = {
  pages: Pages
  bookUrl: string
}

export type BookMetadata = {
  pageOpts: PageOpts
  themeConfig: DocsThemeConfig
}

type Data = { [key: string]: { title: string; type?: string } }

const generatePageMap = (pages: Pages, bookUrl: string) => {
  let init = false
  const map = new Map()

  const createMeta = (pages: Page[]) => {
    return [
      {
        kind: 'Meta',
        data: pages.reduce((acc, page, index) => {
          // create unique key
          const key =
            index === 0 && !init ? 'index' : `${escapeForUrl(`${page.title}-${page.code}`)}`

          const value = { title: `${page.title}-${index}` }

          // save key
          map.set(page.url_slug, key)

          if (page.type === 'separator') {
            Object.assign(value, { type: 'separator' })
          }

          acc[key] = value
          return acc
        }, {} as Data),
      },
    ]
  }

  const createMdxPage = (page: Page) => {
    if (init) {
      const key = map.get(page.url_slug)
      return [
        {
          kind: 'MdxPage',
          name: key,
          route: `${bookUrl}${page.url_slug}`,
        },
      ]
    }
    init = true
    return [
      {
        kind: 'MdxPage',
        name: 'index',
        route: `${bookUrl}`,
      },
    ]
  }

  const createFolder = (page: Page) => {
    const key = map.get(page.url_slug)
    const result = {
      kind: 'Folder',
      name: key,
      route: `${bookUrl}${page.url_slug}`,
      children: [],
    }

    if (page.childrens?.length > 0) {
      const children = page.childrens.reduce(recursive, []).flat()
      Object.assign(result, { children })
      return result
    }
    return result
  }

  const recursive = (result: any[], page: Page, index: number, origin: Page[]) => {
    if (index === 0) {
      result.push(createMeta(origin))
    }

    if (page.type !== 'separator') {
      result.push(createMdxPage(page))
    }

    if (page.childrens?.length > 0) {
      result.push(createFolder(page))
    }
    return result
  }

  const pageMap = pages
    .filter((page) => !page.parent_id)
    .reduce(recursive, [])
    .flat()
  return pageMap as PageMapItem[]
}

export const generateBookMetadata = ({ pages, bookUrl }: Args): BookMetadata => {
  const pageMap = generatePageMap(pages, bookUrl)

  fs.writeFileSync(
    path.resolve(process.cwd(), './src/lib/', './context.json'),
    JSON.stringify(pageMap, null, 4),
  )

  return {
    pageOpts: {
      frontMatter: {},
      filePath: '',
      route: '',
      pageMap,
      title: 'Welcome to Nextra',
      headings: [],
    },
    themeConfig: {},
  }
}
