import type { MdxCompilerOptions } from './index'
import { serialize } from 'next-mdx-remote/serialize'
import grayMatter from 'gray-matter'
// import { createProcessor } from '@mdx-js/mdx'
// import type { Processor } from '@mdx-js/mdx/lib/core'
import { remarkNpm2Yarn } from '@theguild/remark-npm2yarn'
import type { Pluggable } from 'unified'
// import type { Options as RehypePrettyCodeOptions } from 'rehype-pretty-code'
// import rehypePrettyCode from 'rehype-pretty-code'
// import rehypeRaw from 'rehype-raw'
import { setWasm } from 'shiki'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkReadingTime from 'remark-reading-time'
import remarkParse from 'remark-parse'
import rehypeStringify from 'rehype-stringify'
import rehypeRaw from 'rehype-raw'
import remarkMdx from 'remark-mdx'

import {
  attachMeta,
  parseMeta,
  remarkCustomHeadingId,
  remarkHeadings,
  remarkLinkRewrite,
  remarkMdxDisableExplicitJsx,
  remarkRemoveImports,
  remarkReplaceImports,
  remarkStaticImage,
} from './nextra/mdx-plugins'

// import theme from './theme'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { truthy } from './nextra/utils'

const clonedRemarkLinkRewrite = remarkLinkRewrite.bind(null as any)

const MARKDOWN_URL_EXTENSION_REGEX = /\.mdx?(?:(?=[#?])|$)/

// const CODE_BLOCK_FILENAME_REGEX = /filename="([^"]+)"/

// const DEFAULT_REHYPE_PRETTY_CODE_OPTIONS: RehypePrettyCodeOptions = {
//   theme: theme as any,
//   onVisitLine(node: any) {
//     // Prevent lines from collapsing in `display: grid` mode, and
//     // allow empty lines to be copy/pasted
//     if (node.children.length === 0) {
//       node.children = [{ type: 'text', value: ' ' }]
//     }
//   },
//   onVisitHighlightedLine(node: any) {
//     node.properties.className?.push('highlighted')
//   },
//   onVisitHighlightedChars(node: any) {
//     node.properties.className = ['highlighted']
//   },
//   filterMetaString: (meta: string) => meta.replace(CODE_BLOCK_FILENAME_REGEX, ''),
// }

export const mdxCompiler = async (
  source: string,
  { defaultShowCopyCode = true, onigHostUrl = '' }: MdxCompilerOptions = {},
): Promise<MDXRemoteSerializeResult | null> => {
  const { content } = grayMatter(source)

  if (!onigHostUrl) {
    throw new Error('onigHostUrl is required')
  }

  try {
    const onig = await fetch(`${onigHostUrl}/wasm/onig.wasm`)
    setWasm(onig)

    const result = await serialize(content, {
      mdxOptions: {
        format: 'mdx',
        development: false,
        remarkPlugins: [
          remarkParse,
          remarkMdx,
          // remarkMermaid, // should be before remarkRemoveImports because contains `import { Mermaid } from ...`
          [
            remarkNpm2Yarn, // should be before remarkRemoveImports because contains `import { Tabs as $Tabs, Tab as $Tab } from ...`
            {
              packageName: 'nextra/components',
              tabNamesProp: 'items',
              storageKey: 'selectedPackageManager',
            },
          ] satisfies Pluggable,
          remarkRemoveImports,
          // // remarkGfm, // error
          [remarkMdxDisableExplicitJsx, { whiteList: ['details', 'summary'] }] satisfies Pluggable,
          // remarkCustomHeadingId,
          // [remarkHeadings, { isRemoteContent: true }] satisfies Pluggable,
          // remarkStaticImage,
          // remarkReadingTime,
          // remarkMath,
          // remarkReplaceImports,
          // [
          //   clonedRemarkLinkRewrite,
          //   {
          //     pattern: MARKDOWN_URL_EXTENSION_REGEX,
          //     replace: '',
          //     excludeExternalLinks: true,
          //   },
          // ] satisfies Pluggable,
        ].filter(truthy),
        rehypePlugins: (
          [
            // [rehypeRaw, { allowDangerousHtml: true }],
            [parseMeta, { defaultShowCopyCode }] satisfies Pluggable,
            rehypeKatex,
            attachMeta,
            // rehypeStringify,
          ] as any
        ).filter(truthy),
      },
    })

    return result
  } catch (error) {
    console.log('serialize error', error)
    return null
  }
}
