import { useEffect, useMemo, useState } from 'react'
import styles from './MarkdownRender.module.css'
import revertStyles from '@/lib/styles/revert.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { throttle } from 'throttle-debounce'
import prismPlugin from '@/lib/remark/prismPlugin'
import embedPlugin from '@/lib/remark/embedPlugin'
import rehypeDocument from 'rehype-document'
import { htmlFilter } from './utils'
import { loadScript } from '@/lib/utils'
import parse from 'html-react-parser'
import Typography from '../Typography'
import remark from 'remark'
import remarkParse from 'remark-parse'
import breaks from 'remark-breaks'
import remark2rehype from 'remark-rehype'
import math from 'remark-math'
import slug from 'remark-slug'
import raw from 'rehype-raw'
import katex from 'rehype-katex'
import stringify from 'rehype-stringify'

const cx = bindClassNames({ ...styles, ...revertStyles })

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
        .use(breaks)
        .use(remarkParse)
        .use(slug)
        .use(prismPlugin)
        .use(embedPlugin)
        .use(remark2rehype, { allowDangerousHtml: true })
        .use(raw)
        .use(math)
        .use(katex)
        .use(stringify)
        .use(rehypeDocument, {
          // Get the latest one from: <https://katex.org/
          link: {
            rel: 'stylesheet',
            href: 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css',
            integrity: 'sha384-zB1R0rpPzHqg7Kpt0Aljp8JPLqbXI3bhnPWROx27a9N0Ll6ZP/+DiW/UqRcLbRjq',
            crossOrigin: 'anonymous',
          },
        })
        .process(text, (err: any, file: any) => {
          if (err) {
            console.log('markdown-render error', err)
          }

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
            setHtml(htmlFilter(pureHtml || text))
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
  }, [markdown, throttledUpdate, html])

  return (
    <Typography>
      {isEdit ? (
        <div className={cx('block', 'revert', codeTheme)}>{element}</div>
      ) : (
        <div
          className={cx('block', 'revert', codeTheme)}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}
    </Typography>
  )
}

export default MarkdownRender

type RenderedElement = null | string | JSX.Element | JSX.Element[]
