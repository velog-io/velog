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

type InnerLayoutProps = PageOpts & {
  children: ReactNode
}

export const InnerLayout = ({ frontMatter, headings, pageMap }: InnerLayoutProps): ReactElement => {
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

  return (
    <div dir={direction} className={cn('nx-relative nx-flex nx-flex-wrap')}>
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.setAttribute('dir','${direction}')`,
        }}
      />
      <Head />
      <Banner />
      <Header flatDirectories={flatDirectories} items={topLevelNavbarItems} />
      <div className={cn('nextra-main', 'nx-mx-auto nx-flex nx-w-full')}>
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
              <MarkdownEditor />
            </div>
            <div className={cn('nextra-preview-container nx-w-1/2')}>
              <MarkdownPreview />
            </div>
          </div>
        </ActiveAnchorProvider>
      </div>
    </div>
  )
}
