import { useEffect, useMemo, useState } from 'react'
import styles from './MarkdownRender.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { throttle } from 'throttle-debounce'
import prismPlugin from '@/lib/remark/prismPlugin'
import embedPlugin from '@/lib/remark/embedPlugin'
import remarkBreaks from 'remark-breaks'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeDocument from 'rehype-document'
import rehypeKatex from 'rehype-katex'
import rehypeStringify from 'rehype-stringify'
import rehypeSlug from 'rehype-slug'
import { htmlFilter } from './utils'
import { loadScript } from '@/lib/utils'
import parse from 'html-react-parser'
import Typography from '../Typography'
import remarkParse from 'remark-parse'
import { remark } from 'remark'
import remarkMath from 'remark-math'

const cx = bindClassNames(styles)

type Props = {
  markdown: string
  codeTheme?: string
  onConvertFinish?: (html: string) => any
  isEdit?: boolean
}

function MarkdownRender({ markdown, codeTheme = 'atom-one', onConvertFinish, isEdit }: Props) {
  const [html, setHtml] = useState<string>('')
  const [element, setElement] = useState<RenderedElement>(null)
  const [delay, setDelay] = useState(25)

  const throttledUpdate = useMemo(() => {
    return throttle(delay, (text: string) => {
      remark()
        .use(remarkBreaks)
        .use(remarkParse)
        .use(prismPlugin)
        .use(embedPlugin)
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeSlug)
        .use(rehypeRaw)
        .use(remarkMath)
        .use(rehypeDocument, {
          // Get the latest one from: <https://katex.org/
          css: 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css',
        })
        .use(rehypeKatex)
        .use(rehypeStringify)
        .process(text, (_, file: any) => {
          console.log('text', text)
          const lines = text.split(/\r\n|\r|\n/).length
          const nextDelay = Math.max(Math.min(Math.floor(lines * 0.5), 1500), 22)

          if (nextDelay !== delay) {
            setDelay(nextDelay)
          }
          const pureHtml = String(file)

          if (onConvertFinish) {
            onConvertFinish(htmlFilter(pureHtml))
          }
          // load twitter script if needed
          if (pureHtml.indexOf('class="twitter-tweet"') !== -1) {
            // if (window && (window as any).twttr) return;
            loadScript('https://platform.twitter.com/widgets.js')
          }

          if (!isEdit) {
            setHtml(htmlFilter(pureHtml))
            return
          }

          try {
            const el = parse(pureHtml)
            setElement(el)
          } catch (e) {}
        })
    })
  }, [delay, isEdit, onConvertFinish])

  useEffect(() => {
    throttledUpdate(markdown)
    console.log('throttledUpdate', html)
  }, [markdown, throttledUpdate, html])

  return (
    <Typography>
      {isEdit ? (
        <div className={cx('block', codeTheme)}>{element}</div>
      ) : (
        <div className={cx('block', codeTheme)} dangerouslySetInnerHTML={{ __html: html }} />
      )}
    </Typography>
  )
}

export default MarkdownRender

type RenderedElement = null | string | JSX.Element | JSX.Element[]
