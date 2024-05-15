import type { LoaderOptions, PageOpts } from './nextra/types'
import type { ReactNode } from 'react'
import type { DocsThemeConfig } from './constants'
import { ProcessorOptions } from '@mdx-js/mdx'

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

export interface CustomEventDetail {
  AddFileEventDetail: AddFileEventDetail
}

type AddFileEventDetail = {
  title: string
  parentUrlSlug: string
  index: number
  bookUrlSlug: string
}

// for compiler
export type MdxOptions = LoaderOptions['mdxOptions'] &
  Pick<ProcessorOptions, 'jsx' | 'outputFormat'>
export type MdxCompilerOptions = Partial<
  Pick<
    LoaderOptions,
    'staticImage' | 'flexsearch' | 'defaultShowCopyCode' | 'readingTime' | 'latex' | 'codeHighlight'
  > & {
    mdxOptions?: MdxOptions
    route?: string
    locale?: string
    filePath?: string
    useCachedCompiler?: boolean
    isPageImport?: boolean
  }
>
