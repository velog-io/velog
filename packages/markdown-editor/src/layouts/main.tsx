import cn from 'clsx'
import { DEFAULT_LOCALE } from '@/constants'
import { ActiveAnchorProvider } from '@/contexts'
import { useFSRoute } from '@/nextra/hooks'
import { normalizePages } from '@/nextra/normalize-pages'
import type { PageOpts } from '@/nextra/types'
import { useEffect, useMemo, useRef, useState, type ReactElement, type ReactNode } from 'react'
import { Banner, Head, Header, Sidebar } from '@/components'
import { MarkdownPreview } from '@/components/markdown-preview'
import { MarkdownEditor } from '@/components/markdown-editor'

type MainProps = PageOpts & {
  children: ReactNode
}

export const Main = ({ frontMatter, headings, pageMap }: MainProps): ReactElement => {
  const fsPath = useFSRoute()
  const editorRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  const rerender = useState({})[1]

  useEffect(() => {
    const trigger = () => rerender({})
    trigger()
  }, [])

  useEffect(() => {
    console.log('editorRef:', editorRef)
    console.log('previewRef:', previewRef)
  }, [editorRef, previewRef])

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
            <div className={cn('nextra-editor-container nx-w-1/2')}>
              <MarkdownEditor ref={editorRef} />
            </div>
            <div className={cn('nextra-preview-container nx-w-1/2')}>
              <MarkdownPreview ref={previewRef} />
            </div>
          </div>
        </ActiveAnchorProvider>
      </div>
    </div>
  )
}
