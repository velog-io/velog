import type { PageOpts } from './nextra/types'
import type { ReactNode } from 'react'
import type { DocsThemeConfig } from './constants'

export type Context = {
  pageOpts: PageOpts
  themeConfig: DocsThemeConfig
}

export type SearchResult = {
  children: ReactNode
  id: string
  prefix?: ReactNode
  route: string
}
