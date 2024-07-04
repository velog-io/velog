import 'focus-visible'
import './polyfill'
import { PartialDocsThemeConfig } from './constants'
import type { CustomEventDetail, MdxCompilerOptions, MdxOptions, SearchResult } from './types'

export type {
  PartialDocsThemeConfig as DocsThemeConfig,
  CustomEventDetail,
  MdxCompilerOptions,
  MdxOptions,
  SearchResult,
}
export const nextraCustomEventName: Record<keyof CustomEventDetail, string> = {
  createOrUpdateItemEvent: 'createOrUpdateItemEvent',
  changeItemOrderEvent: 'changeItemOrderEvent',
  saveItemBodyEvent: 'saveItemBodyEvent',
  deployStartEvent: 'deployStartEvent',
  deployEndEvent: 'deployEndEvent',
  deleteItemEvent: 'deleteItemEvent',
}
export { MarkdownEditor } from './layouts'
