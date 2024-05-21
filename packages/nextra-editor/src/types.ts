import type { LoaderOptions, PageMapItem, PageOpts } from './nextra/types'
import type { ReactNode } from 'react'
import type { DocsThemeConfig } from './constants'
import { ProcessorOptions } from '@mdx-js/mdx'
import { UniqueIdentifier } from '@dnd-kit/core'

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
  AddActionEventDetail: AddActionEventDetail
}

type AddActionEventDetail = {
  title: string
  parentUrlSlug: string
  index: number
  bookUrlSlug: string
  type: 'page' | 'folder' | 'separator'
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

export type TreeItems<T extends Record<string, any>> = TreeItem<T>[]
export type TreeItem<T = PageMapItem> = {
  children?: TreeItem<T>[]
  id: UniqueIdentifier
  /*
  Default: false.
   */
  collapsed?: boolean

  /*
  If false, doesn't allow to drag&drop nodes so that they become children of current node.
  If you are showing files&directories it makes sense to set this to `true` for folders, and `false` for files.
  Default: true.
   */
  canHaveChildren?: boolean | ((dragItem: FlattenedItem<T>) => boolean)

  /*
  If true, the node can not be sorted/moved/dragged.
  Default: false.
   */
  disableSorting?: boolean
} & T

export type FlattenedItem<T = PageMapItem> = {
  parentId: UniqueIdentifier | null
  /*
  How deep in the tree is current item.
  0 - means the item is on the Root level,
  1 - item is child of Root level parent,
  etc.
   */
  depth: number
  index: number

  /*
  Is item the last one on it's deep level.
  This could be important for visualizing the depth level (e.g. in case of FolderTreeItemWrapper)
   */
  isLast: boolean
  parent: FlattenedItem<T> | null
} & TreeItem<T>
