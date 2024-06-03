import type { MdxCompilerOptions, PageOpts } from './index'
import { serialize } from 'next-mdx-remote/serialize'
import grayMatter from 'gray-matter'
// import { createProcessor } from '@mdx-js/mdx'
// import type { Processor } from '@mdx-js/mdx/lib/core'
import { remarkNpm2Yarn } from '@theguild/remark-npm2yarn'
import type { Pluggable } from 'unified'
// import type { Options as RehypePrettyCodeOptions } from 'rehype-pretty-code'
// import rehypePrettyCode from 'rehype-pretty-code'
import rehypeRaw from 'rehype-raw'
import { setWasm } from 'shiki'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkReadingTime from 'remark-reading-time'
// import remarkSmartypants from 'remark-smartypants'
// import { remarkMermaid } from '@theguild/remark-mermaid'

import {
  attachMeta,
  parseMeta,
  remarkCustomHeadingId,
  remarkHeadings,
  remarkLinkRewrite,
  remarkMdxDisableExplicitJsx,
  remarkRemoveImports,
  remarkStaticImage,
} from './nextra/mdx-plugins'

// import theme from './theme'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { truthy } from './nextra/utils'
import { createProcessor, Processor } from '@mdx-js/mdx/lib/core'
import { ReadingTime, StructurizedData } from './nextra/types'

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
): Promise<MDXRemoteSerializeResult> => {
  const { data: frontmatter, content } = grayMatter(source)

  if (!onigHostUrl) {
    throw new Error('onigHostUrl is required')
  }

  try {
    const onig = await fetch(`${onigHostUrl}/wasm/onig.wasm`)
    setWasm(onig)

    const compiler = createCompiler({})
    const processor = compiler()

    const vFile = await processor.process(content)

    const { title, hasJsxInH1, readingTime } = vFile.data as {
      readingTime?: ReadingTime
      structurizedData: StructurizedData
      title?: string
    } & Pick<PageOpts, 'hasJsxInH1'>

    const result = String(vFile).replaceAll('__esModule', '_\\_esModule')

    return {
      compiledSource: result,
      ...(title && { title }),
      ...(hasJsxInH1 && { hasJsxInH1 }),
      ...(readingTime && { readingTime }),
      ...{ headings: vFile.data.headings },
      frontmatter,
      scope: {},
    }
  } catch (error) {
    console.log('error', error)
    throw error
  }
}

function createCompiler({ format = 'md' }: any): Processor {
  return createProcessor({
    jsx: true,
    format,
    outputFormat: 'program',
    providerImportSource: 'nextra/mdx',
    remarkPlugins: [
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
      remarkGfm,
      format !== 'md' &&
        ([
          remarkMdxDisableExplicitJsx,
          // Replace the <summary> and <details> with customized components
          { whiteList: ['details', 'summary'] },
        ] satisfies Pluggable),
      remarkCustomHeadingId,
      [remarkHeadings, { isRemoteContent: true }] satisfies Pluggable,
      // structurize should be before remarkHeadings because we attach #id attribute to heading node
      remarkStaticImage,
      remarkReadingTime,
      remarkMath,
      // isFileOutsideCWD && remarkReplaceImports,
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
    rehypePlugins: [
      format === 'md' && [
        // To render <details /> and <summary /> correctly
        rehypeRaw,
        // fix Error: Cannot compile `mdxjsEsm` node for npm2yarn and mermaid
        { passThrough: ['mdxjsEsm', 'mdxJsxFlowElement'] },
      ],
      [parseMeta, { defaultShowCopyCode: true }],
      // Should be before `rehypePrettyCode`
      rehypeKatex,
      [
        // rehypePrettyCode,
        // {
        //   ...DEFAULT_REHYPE_PRETTY_CODE_OPTIONS,
        //   ...rehypePrettyCodeOptions,
        // },
      ] as any,
      attachMeta,
    ].filter(truthy),
  })
}
