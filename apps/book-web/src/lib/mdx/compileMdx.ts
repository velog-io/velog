import type { MdxCompilerOptions, MdxOptions } from '@packages/nextra-editor'
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
import {
  attachMeta,
  parseMeta,
  remarkCustomHeadingId,
  remarkHeadings,
  remarkLinkRewrite,
  remarkMdxDisableExplicitJsx,
  remarkRemoveImports,
  remarkStaticImage,
  remarkReplaceImports,
} from '@packages/nextra-editor'
import { truthy } from './utils'
// import theme from './theme'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'

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
  { defaultShowCopyCode = true, mdxOptions }: MdxCompilerOptions = {},
): Promise<MDXRemoteSerializeResult> => {
  const { data: frontmatter, content } = grayMatter(source)

  const { remarkPlugins, rehypePlugins }: MdxOptions = {
    ...mdxOptions,
    // You can override MDX options in the frontMatter too.
    ...frontmatter.mdxOptions,
  }

  try {
    const onig = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_HOST}/wasm/onig.wasm`)
    setWasm(onig)

    const result = await serialize(content, {
      mdxOptions: {
        development: process.env.NODE_ENV === 'development',
        remarkPlugins: [
          ...(remarkPlugins || []),
          // // remarkMermaid, // should be before remarkRemoveImports because contains `import { Mermaid } from ...`
          [
            remarkNpm2Yarn, // should be before remarkRemoveImports because contains `import { Tabs as $Tabs, Tab as $Tab } from ...`
            {
              packageName: 'nextra/components',
              tabNamesProp: 'items',
              storageKey: 'selectedPackageManager',
            },
          ] satisfies Pluggable,
          remarkRemoveImports,
          remarkGfm,
          [
            remarkMdxDisableExplicitJsx,
            // Replace the <summary> and <details> with customized components
            { whiteList: ['details', 'summary'] },
          ] satisfies Pluggable,
          remarkCustomHeadingId,
          [remarkHeadings, { isRemoteContent: true }] satisfies Pluggable,
          // structurize should be before remarkHeadings because we attach #id attribute to heading node
          // flexsearch && ([remarkStructurize, flexsearch] satisfies Pluggable),
          remarkStaticImage,
          remarkReadingTime,
          remarkMath,
          remarkReplaceImports,
          // Remove the markdown file extension from links
          [
            clonedRemarkLinkRewrite,
            {
              pattern: MARKDOWN_URL_EXTENSION_REGEX,
              replace: '',
              excludeExternalLinks: true,
            },
          ] satisfies Pluggable,
        ].filter(truthy),
        rehypePlugins: (
          [
            ...(rehypePlugins || []),
            // [
            //   // To render <details /> and <summary /> correctly
            // rehypeRaw,
            //   // fix Error: Cannot compile `mdxjsEsm` node for npm2yarn and mermaid
            //   { passThrough: ['mdxjsEsm', 'mdxJsxFlowElement'] },
            // ],
            [parseMeta, { defaultShowCopyCode }] satisfies Pluggable,
            // // Should be before `rehypePrettyCode`
            rehypeKatex,
            // [
            //   rehypePrettyCode,
            //   {
            //     ...DEFAULT_REHYPE_PRETTY_CODE_OPTIONS,
            //     ...rehypePrettyCodeOptions,
            //   },
            // ] as any,
            attachMeta satisfies Pluggable,
          ] as any
        ).filter(truthy),
      },
    })

    return result
  } catch (error) {
    throw error
  }
}
