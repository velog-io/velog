import { useEffect, useMemo, useState } from 'react'
import styles from './MarkdownRender.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { throttle } from 'throttle-debounce'
import { remark } from 'remark'
import breaks from 'remark-breaks'
import math from 'remark-math'
import remarkRehype from 'remark-rehype'
import remarkParse from 'remark-parse'
import prismPlugin from '@/lib/remark/prismPlugin'
import embedPlugin from '@/lib/remark/embedPlugin'
import remarkRaw from 'rehype-raw'
import rehypeDocument from 'rehype-document'
import rehypeKatex from 'rehype-katex'
import rehypeParse from 'rehype-parse'
import rehypeStringify from 'rehype-stringify'
import rehypeSlug from 'rehype-slug'
import { htmlFilter } from './utils'
import { loadScript } from '@/lib/utils'
import parse from 'html-react-parser'

const cx = bindClassNames(styles)

type Props = {
  markdown: string
  codeTheme?: string
  onConvertFinish?: (html: string) => any
  editing?: boolean
}

function MarkdownRender({ markdown, codeTheme = 'atom-one', onConvertFinish, editing }: Props) {
  const [html, setHtml] = useState<string | null>(null)
  const [element, setElement] = useState<RenderedElement>(null)
  const [delay, setDelay] = useState(25)

  const throttledUpdate = useMemo(() => {
    return throttle(delay, (text: string) => {
      remark()
        .use(breaks)
        .use(remarkParse)
        .use(rehypeSlug)
        .use(prismPlugin)
        .use(embedPlugin)
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(remarkRaw)
        .use(math)
        .use(rehypeParse, { fragment: true })
        .use(rehypeKatex)
        .use(rehypeDocument, {
          // Get the latest one from: <https://katex.org/
          css: 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css',
        })
        .use(rehypeKatex)
        .use(rehypeStringify)
        .process(markdown, (_, file: any) => {
          const lines = markdown.split(/\r\n|\r|\n/).length
          const nextDelay = Math.max(Math.min(Math.floor(lines * 0.5), 1500), 22)

          if (nextDelay !== delay) {
            setDelay(nextDelay)
          }
          const html = String(file)
          if (onConvertFinish) {
            onConvertFinish(htmlFilter(html))
          }
          // load twitter script if needed
          if (html.indexOf('class="twitter-tweet"') !== -1) {
            // if (window && (window as any).twttr) return;
            loadScript('https://platform.twitter.com/widgets.js')
          }

          if (!editing) {
            setHtml(htmlFilter(html))
            return
          }

          try {
            const el = parse(html)
            setElement(el)
          } catch (e) {}
        })
    })
  }, [markdown, delay, editing, onConvertFinish])

  useEffect(() => {
    throttledUpdate(markdown)
  }, [markdown, throttledUpdate])

  return <div className={cx('block')}></div>
}

export default MarkdownRender

type RenderedElement = null | string | JSX.Element | JSX.Element[]
