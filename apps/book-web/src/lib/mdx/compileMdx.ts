import type { MdxCompilerOptions, MdxOptions } from '@packages/nextra-theme-docs'
import grayMatter from 'gray-matter'
import { createProcessor } from '@mdx-js/mdx'
import type { Processor } from '@mdx-js/mdx/lib/core'
import { remarkNpm2Yarn } from '@theguild/remark-npm2yarn'
import { remarkMermaid } from '@theguild/remark-mermaid'
import type { Pluggable } from 'unified'
import type { Options as RehypePrettyCodeOptions } from 'rehype-pretty-code'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeRaw from 'rehype-raw'
import { getHighlighter, setWasm } from 'shiki'
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
} from '@packages/nextra-theme-docs'
import { truthy } from './utils'
import theme from './theme'
import rehypeShiki from '@shikijs/rehype'
// import { loadWasm } from '@shikijs/core'

const clonedRemarkLinkRewrite = remarkLinkRewrite.bind(null as any)

const MARKDOWN_URL_EXTENSION_REGEX = /\.mdx?(?:(?=[#?])|$)/

const CODE_BLOCK_FILENAME_REGEX = /filename="([^"]+)"/

const DEFAULT_REHYPE_PRETTY_CODE_OPTIONS: RehypePrettyCodeOptions = {
  theme: theme as any,
  onVisitLine(node: any) {
    // Prevent lines from collapsing in `display: grid` mode, and
    // allow empty lines to be copy/pasted
    if (node.children.length === 0) {
      node.children = [{ type: 'text', value: ' ' }]
    }
  },
  onVisitHighlightedLine(node: any) {
    node.properties.className?.push('highlighted')
  },
  onVisitHighlightedWord(node: any) {
    node.properties.className = ['highlighted']
  },
  filterMetaString: (meta: string) => meta.replace(CODE_BLOCK_FILENAME_REGEX, ''),
}

export type MdxCompilerResult = {
  compiledSource: string
  title?: string
  hasJsxInH1?: boolean
  readingTime?: ReadingTime
  headings?: Headings
  frontmatter: {
    [key: string]: any
  }
}

export const mdxCompiler = async (
  source: string,
  {
    staticImage = true,
    readingTime = true,
    latex = true,
    codeHighlight = true,
    defaultShowCopyCode = true,
    mdxOptions,
  }: MdxCompilerOptions = {},
): Promise<MdxCompilerResult> => {
  const { data: frontmatter, content } = grayMatter(source)

  const {
    jsx = false,
    // format: _format = 'mdx',
    outputFormat = 'function-body',
    remarkPlugins,
    rehypePlugins,
    rehypePrettyCodeOptions,
  }: MdxOptions = {
    ...mdxOptions,
    // You can override MDX options in the frontMatter too.
    ...frontmatter.mdxOptions,
  }

  const onig = await fetch('http://localhost:3000/wasm/onig.wasm')
  setWasm(onig)

  const compiler = await createCompiler()

  try {
    const processor = compiler()

    const vFile = await processor.process(content)

    const result = String(vFile).replaceAll('__esModule', '_\\_esModule')

    const { title, hasJsxInH1, readingTime, headings } = vFile.data as {
      readingTime?: ReadingTime
      title?: string
      hasJsxInH1?: boolean
      headings: Headings
    }

    return {
      compiledSource: result,
      ...(title && { title }),
      ...(hasJsxInH1 && { hasJsxInH1 }),
      ...(readingTime && { readingTime }),
      ...(headings && { headings: vFile.data.headings as Headings }),
      frontmatter,
    }
  } catch (error) {
    console.error(error)
    throw error
  }

  async function createCompiler(): Promise<Processor> {
    // const highlighter = await getHighlighter({
    //   themes: Object.keys(bundledThemes),
    //   langs: Object.keys(bundledLanguages),
    // })

    return createProcessor({
      jsx,
      outputFormat,
      providerImportSource: 'nextra/mdx',
      remarkPlugins: [
        ...(remarkPlugins || []),
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
        [
          remarkMdxDisableExplicitJsx,
          // Replace the <summary> and <details> with customized components
          { whiteList: ['details', 'summary'] },
        ] satisfies Pluggable,
        remarkCustomHeadingId,
        [remarkHeadings, { isRemoteContent: true }] satisfies Pluggable,
        // structurize should be before remarkHeadings because we attach #id attribute to heading node
        // flexsearch && ([remarkStructurize, flexsearch] satisfies Pluggable),
        staticImage && remarkStaticImage,
        readingTime && remarkReadingTime,
        latex && remarkMath,
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
      rehypePlugins: [
        ...(rehypePlugins || []),
        // [
        //   // To render <details /> and <summary /> correctly
        //   rehypeRaw,
        //   // fix Error: Cannot compile `mdxjsEsm` node for npm2yarn and mermaid
        //   { passThrough: ['mdxjsEsm', 'mdxJsxFlowElement'] },
        // ],
        [parseMeta, { defaultShowCopyCode }],
        // Should be before `rehypePrettyCode`
        latex && rehypeKatex,
        [
          rehypePrettyCode,
          {
            ...DEFAULT_REHYPE_PRETTY_CODE_OPTIONS,
            ...rehypePrettyCodeOptions,
          },
        ] as any,
        attachMeta,
      ].filter(truthy),
    })
  }
}

type ReadingTime = {
  text: string
  minutes: number
  time: number
  words: number
}

type Headings = {
  depth: number
  value: string
  id: string
}[]
