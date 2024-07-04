import * as react from 'react'
import 'gray-matter'
import 'mdast'
import { PageOpts } from './nextra/types'

/**
 * This hook is used to access the internal state of Nextra, you should never
 * use this hook in your application.
 */
declare function useInternals(): {
  context: {
    Content: react.FC
    pageOpts: PageOpts<{
      [key: string]: any
    }>
    themeConfig: any
  }
  Layout: react.FC<any>
}

export { useInternals }

declare module 'title' {
  export default function title(
    title: string,
    special?: {
      special: string[]
    },
  )
}

declare namespace globalThis {
  import type { PageMapItem } from './types'
  const __nextra_resolvePageMap: Record<string, () => Promise<PageMapItem[]>>
}

declare module 'next/dist/compiled/webpack/webpack.js' {
  export { default as webpack, sources } from 'webpack'
}

declare module '*.svg' {
  import type { ComponentPropsWithRef, ReactElement } from 'react'
  export const ReactComponent: (_props: ComponentPropsWithRef<'svg'>) => ReactElement
}
