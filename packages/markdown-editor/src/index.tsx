import 'focus-visible'
import './polyfill'
import { PartialDocsThemeConfig } from './constants'
import type { CustomEventDetail, MdxCompilerOptions, MdxOptions, SearchResult } from './types'
import type { PageMapItem, PageOpts } from './nextra/types'

export type {
  PartialDocsThemeConfig as DocsThemeConfig,
  CustomEventDetail,
  MdxCompilerOptions,
  MdxOptions,
  SearchResult,
  PageMapItem,
  PageOpts,
}
export { Layout as MarkdownEditor } from './layouts'
export const markdownCustomEventName: Record<keyof CustomEventDetail, string> = {
  createItemEvent: 'createItemEvent',
  updateItemEvent: 'updateItemEvent',
  updateItemResultEvent: 'updateItemResultEvent',
  changeItemOrderEvent: 'changeItemOrderEvent',
  deployStartEvent: 'deployStartEvent',
  deployEndEvent: 'deployEndEvent',
  deleteItemEvent: 'deleteItemEvent',
}
