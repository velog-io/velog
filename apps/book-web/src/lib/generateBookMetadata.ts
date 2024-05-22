/* eslint-disable @typescript-eslint/no-var-requires */
import type { DocsThemeConfig, PageMapItem, PageOpts } from '@packages/nextra-editor'
import { escapeForUrl } from './utils'
// import fs from 'node:fs'
// import path from 'node:path'

type Pages = Page[]
type Page = {
  id: string
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

const removeCode = (page: Page) => {
  let route = page.parent_id === null ? '/' : page.url_slug.split('/').slice(0, -1).join('/')
  if (route === '') {
    route = page.url_slug.split('-')[0]
    if (!route) {
      console.log('route is empty', route)
    }
  }
  return route
}

const generatePageMap = (pages: Pages, bookUrl: string) => {
  let init = false
  const map = new Map()

  const createMeta = (pages: Page[], route: string) => {
    return [
      {
        id: route,
        kind: 'Meta',
        route,
        data: pages.reduce((acc, page, index) => {
          // create unique key
          const key =
            index === 0 && !init ? 'index' : `${escapeForUrl(`${page.title}-${page.code}`)}`

          const value = { title: `${page.title}-${index}` }

          // save key
          map.set(page.url_slug, key)

          if (page.type === 'separator') {
            Object.assign(value, { id: page.id, type: 'separator' })
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
          id: `${bookUrl}${page.url_slug}`,
          kind: 'MdxPage',
          name: key,
          route: `${bookUrl}${page.url_slug}`,
        },
      ]
    }
    init = true
    return [
      {
        id: `${bookUrl}${page.url_slug}`,
        kind: 'MdxPage',
        name: 'index',
        route: `${bookUrl}`,
      },
    ]
  }

  const createFolder = (page: Page) => {
    const key = map.get(page.url_slug)
    const result = {
      id: page.id,
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

    if (page.childrens?.length === 0) {
      const route = page.url_slug.split('-').slice(0, -1).join('-')
      const metaJson = createMeta([], route)[0] as PageMapItem
      ;(result.children as PageMapItem[]).push(metaJson)
    }

    return result
  }

  const recursive = (result: any[], page: Page, index: number, origin: Page[]) => {
    if (index === 0) {
      const route = removeCode(page)
      result.push(createMeta(origin, route))
    }
    if (page.type !== 'separator') {
      result.push(createMdxPage(page))
    }
    if (page.childrens?.length > 0 || page.type === 'folder') {
      result.push(createFolder(page))
    }
    return result
  }

  const pageMap = pages.reduce(recursive, []).flat()
  return pageMap as PageMapItem[]
}

export const generateBookMetadata = ({ pages, bookUrl }: Args): BookMetadata => {
  const pageMap = generatePageMap(pages, bookUrl)

  if (global.window === undefined) {
    const fs = require('node:fs')
    const path = require('node:path')

    fs.writeFileSync(
      path.resolve(process.cwd(), './src/lib/', './context.json'),
      JSON.stringify(pageMap, null, 4),
    )
  }

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
