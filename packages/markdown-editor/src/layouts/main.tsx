import cn from 'clsx'
import { DEFAULT_LOCALE } from '@/constants'
import { ActiveAnchorProvider } from '@/contexts'
import { useFSRoute } from '@/nextra/hooks'
import { normalizePages } from '@/nextra/normalize-pages'
import type { PageOpts } from '@/nextra/types'
import { useMemo, type ReactElement, type ReactNode } from 'react'
import { Banner, Head, Header, Sidebar } from '@/components'
import { MarkdownPreview } from '@/components/markdown-preview'
import { MarkdownEditor } from '@/components/markdown-editor'

type MainProps = PageOpts & {
  children: ReactNode
}

export const Main = ({ frontMatter, headings, pageMap }: MainProps): ReactElement => {
  const fsPath = useFSRoute()

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
  const height = 'calc(100vh - (var(--nextra-navbar-height)) - var(--nextra-editor-toolbar-height))'
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
          <main className={cn('markdown-main nx-flex nx-w-full nx-overflow-hidden')}>
            <div
              className={cn('markdown-editor-container nx-relative nx-flex nx-w-1/2 nx-flex-col')}
            >
              <MarkdownEditor height={height} />
            </div>
            <div className={cn('markdown-preview-container nx-flex nx-w-1/2')}>
              <MarkdownPreview height={height} />
            </div>
          </main>
        </ActiveAnchorProvider>
      </div>
    </div>
  )
}
