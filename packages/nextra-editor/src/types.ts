import type { LoaderOptions, PageMapItem, PageOpts } from './nextra/types'
import type { ReactNode } from 'react'
import type { DocsThemeConfig } from './constants'
import type { ProcessorOptions } from '@mdx-js/mdx'
import type { UniqueIdentifier } from '@dnd-kit/core'
import type { PageItem, SortableItem } from './nextra/normalize-pages'

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
  createOrUpdateItemEvent: CreateOrUpdateItemEvent
  changeItemOrderEvent: ChangeItemOrderEvent
  deleteItemEvent: DeleteItemEvent
  saveItemBodyEvent: SaveItemBodyEvent
  deployStartEvent: DeployStartEvent
  deployEndEvent: DeployEndEvent
}

type CreateOrUpdateItemEvent = {
  pageId?: string
  title: string
  parentUrlSlug: string
  index: number
  bookUrlSlug: string
  type: 'page' | 'folder' | 'separator'
}

type ChangeItemOrderEvent = {
  bookUrlSlug: string
  targetUrlSlug: string
  parentUrlSlug: string | null
  index: number
}

type SaveItemBodyEvent = {
  body: string
}

type DeployStartEvent = {}

type DeployEndEvent = {
  publishedUrl: string | null
}

type DeleteItemEvent = {
  pageId: string
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
    onigHostUrl: string
    isError?: boolean
  }
>

export type TreeItems<T extends Record<string, any>> = TreeItem<T>[]
export type TreeItem<T = PageMapItem> = {
  children?: TreeItem<T>[]
  childrenIds?: UniqueIdentifier[]
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

export type FlattenedItem<T = SortableItem> = {
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

export type ItemChangedReason<T = PageItem> =
  | {
      /*
       * User removed some node (e.g. by clicking on Delete button within the item)
       */
      type: 'removed'

      /*
       * Item that was removed
       */
      item: TreeItem<T>
    }
  | {
      /*
       * User finished dragging an item and dropped it somewhere
       */
      type: 'dropped'

      /*
       * Item that was dragged
       */
      draggedItem: TreeItem<T>

      /*
       * New parent of dragged item. Null if it became a root item
       */
      droppedToParent: TreeItem<T> | null

      /*
       * Old parent of dragged item. Null if it was one of the root items
       */
      draggedFromParent: TreeItem<T> | null
    }
  | {
      /*
       * User collapsed/expanded some item, so that their children are not visible anymore (if type is `collapsed`) or become visible (if type is `expanded`)
       */
      type: 'collapsed' | 'expanded'

      /*
       * Item that was collapsed or expanded
       */
      item: TreeItem<T>
    }
