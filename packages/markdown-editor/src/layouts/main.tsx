import cn from 'clsx'
import { DEFAULT_LOCALE } from '@/constants'
import { ActiveAnchorProvider } from '@/contexts'
import { useFSRoute } from '@/nextra/hooks'
import { normalizePages } from '@/nextra/normalize-pages'
import type { PageOpts } from '@/nextra/types'
import { useCallback, useEffect, useMemo, useRef, type ReactElement, type ReactNode } from 'react'
import { Banner, Head, Header, Sidebar } from '@/components'
import { MarkdownPreview } from '@/components/markdown-preview'
import { MarkdownEditor } from '@/components/markdown-editor'
import { ReactCodeMirrorRef } from '@/types'
import * as events from '@uiw/codemirror-extensions-events'

type MainProps = PageOpts & {
  children: ReactNode
}

export const Main = ({ frontMatter, headings, pageMap }: MainProps): ReactElement => {
  const fsPath = useFSRoute()
  const editorRef = useRef<ReactCodeMirrorRef>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const active = useRef<'editor' | 'preview'>('editor')

  const { activeThemeContext, docsDirectories, flatDirectories, directories, topLevelNavbarItems } =
    useMemo(
      () =>
        normalizePages({
          list: pageMap,
          locale: DEFAULT_LOCALE,
          defaultLocale: DEFAULT_LOCALE,
          route: '/',
        }),
      [pageMap, fsPath],
    )

  const themeContext = { ...activeThemeContext, ...frontMatter }
  const direction = 'ltr'
  const mainHeight = 'calc(100vh - (var(--nextra-navbar-height)))'

  const previewScrollHandle = useCallback(() => {
    // const target = event.target as HTMLDivElement
    // const percent = target.scrollTop / target.scrollHeight

    if (active.current === 'editor' && previewRef.current) {
      const previewHeight = previewRef.current?.scrollHeight || 0
      previewRef.current.scrollTop = previewHeight
    }
    // else if (editorRef.current && editorRef.current.view) {
    //   const editorScrollDom = editorRef.current.view.scrollDOM
    //   const editorScrollHeihgt = editorRef.current.view.scrollDOM.scrollHeight || 0
    //   editorScrollDom.scrollTop = editorScrollHeihgt * percent
    // }
  }, [])

  const mouseoverHandle = () => (active.current = 'preview')
  const mouseleaveHandle = () => (active.current = 'editor')
  useEffect(() => {
    const $preview = previewRef.current
    if ($preview) {
      console.log('add event listener')
      $preview.addEventListener('mouseover', mouseoverHandle, false)
      $preview.addEventListener('mouseleave', mouseleaveHandle, false)
      $preview.addEventListener('scroll', previewScrollHandle, false)
    }
    return () => {
      if ($preview) {
        $preview.removeEventListener('mouseover', mouseoverHandle)
        $preview.removeEventListener('mouseleave', mouseoverHandle)
        $preview.addEventListener('mouseleave', previewScrollHandle, false)
      }
    }
  }, [previewRef, previewScrollHandle])

  const scrollExtensions = events.scroll({
    scroll: previewScrollHandle,
  })

  return (
    <div
      dir={direction}
      className={cn(
        'nx-relative nx-flex nx-h-screen nx-flex-col nx-flex-nowrap nx-overflow-hidden',
      )}
    >
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.setAttribute('dir','${direction}')`,
        }}
      />
      <Head />
      <Banner />
      <Header flatDirectories={flatDirectories} items={topLevelNavbarItems} />
      <div
        className={cn('nextra-main', 'nx-mx-auto nx-flex nx-w-full')}
        style={{ height: mainHeight }}
      >
        <ActiveAnchorProvider>
          <Sidebar
            docsDirectories={docsDirectories}
            flatDirectories={flatDirectories}
            fullDirectories={directories}
            headings={headings}
            asPopover={false}
            includePlaceholder={themeContext.layout === 'default'}
          />
          <div className={cn('nx-flex nx-overflow-hidden')} style={{ width: 'calc(100% - 320px)' }}>
            <div className={cn('nextra-editor-container nx-h-[100%] nx-w-1/2')}>
              <MarkdownEditor ref={editorRef} codeMirrorExtensions={[scrollExtensions]} />
            </div>
            <div className={cn('nextra-preview-container nx-h-[100%] nx-w-1/2')}>
              <MarkdownPreview ref={previewRef} />
            </div>
          </div>
        </ActiveAnchorProvider>
      </div>
    </div>
  )
}
