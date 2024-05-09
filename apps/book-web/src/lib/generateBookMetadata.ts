import type { DocsThemeConfig, PageMapItem, PageOpts } from '@packages/nextra-editor'
import fs from 'node:fs'
import path from 'node:path'

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
  const createMeta = (pages: Page[]) => {
    return [
      {
        kind: 'Meta',
        data: pages.reduce((acc, page) => {
          const key = `${page.title}-${page.code}`
          const value = { title: page.title }
          if (page.type === 'separator') {
            Object.assign(value, { type: 'separator' })
          }
          acc[key] = value
          return acc
        }, {} as Data),
      },
    ]
  }

  const createMdxPage = (page: Page, index: number) => {
    return [
      {
        kind: 'MdxPage',
        name: index === 0 ? 'index' : page.title,
        route: `${bookUrl}/${page.url_slug}`,
      },
    ]
  }

  const recursive = (page: Page, index: number, origin: Page[]) => {
    const result = []
    if (index === 0) {
      const meta = createMeta(origin)
      result.push(meta)
    }
    if (index !== 0) {
      result.push(createMdxPage(page, index))
    }
    if (page.childrens?.length > 0) {
      result.push(createFolder(page))
    }
    return result
  }

  const createFolder = (page: Page) => {
    const result = {
      kind: 'Folder',
      name: page.title,
      route: `${bookUrl}/${page.url_slug}`,
    }

    if (page.childrens?.length > 0) {
      const children = page.childrens.flatMap(recursive)
      Object.assign(result, { children })
      return result
    }
  }

  const pageMap = pages.flatMap(recursive)
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
