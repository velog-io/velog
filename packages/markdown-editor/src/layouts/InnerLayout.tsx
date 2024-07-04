import cn from 'clsx'
import { DEFAULT_LOCALE } from '@/constants'
import { ActiveAnchorProvider, useConfig } from '@/contexts'
import { useMarkdownEditor } from '@/contexts/markdown-editor'
import { useFSRoute } from '@/nextra/hooks'
import { normalizePages } from '@/nextra/normalize-pages'
import type { PageOpts } from '@/nextra/types'
import { useMemo, type ReactElement, type ReactNode } from 'react'
import { Banner, Breadcrumb, Head, Header, NavLinks, Sidebar } from '@/components'
import { MarkdownEditor } from '@/components/markdown-editor'
import { Body } from './Body'
import { MDXRemote } from 'next-mdx-remote'
import { getComponents } from '@/mdx-components'

type InnerLayoutProps = PageOpts & {
  children: ReactNode
}

export const InnerLayout = ({
  frontMatter,
  headings,
  children,
  pageMap,
}: InnerLayoutProps): ReactElement => {
  const config = useConfig()
  const fsPath = useFSRoute()
  const { mdxSource } = useMarkdownEditor()

  const {
    activeType,
    activeIndex,
    activeThemeContext,
    activePath,
    docsDirectories,
    flatDirectories,
    flatDocsDirectories,
    directories,
    topLevelNavbarItems,
  } = useMemo(
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

  if (!mdxSource) {
    return <div>Mdx source Loading...</div>
  }

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
      <div
        className={cn(
          'nextra-main',
          'nx-mx-auto nx-flex nx-w-full',
          themeContext.layout === 'raw' && 'nx-max-w-[90rem] nx-flex-row',
        )}
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
              <MarkdownEditor />
            </div>
            <div className={cn('nextra-preview-container nx-w-1/2')}>
              <Body
                themeContext={themeContext}
                breadcrumb={<Breadcrumb activePath={activePath} />}
                timestamp={new Date().getTime()}
                navigation={
                  activeType !== 'page' && themeContext.pagination ? (
                    <NavLinks flatDirectories={flatDocsDirectories} currentIndex={activeIndex} />
                  ) : null
                }
              >
                <MDXRemote
                  compiledSource={mdxSource.compiledSource}
                  frontmatter={mdxSource.frontmatter}
                  scope={mdxSource.scope}
                  components={getComponents({
                    isRawLayout: themeContext.layout === 'raw',
                    components: config.components,
                  })}
                />
                {children}
              </Body>
            </div>
          </div>
        </ActiveAnchorProvider>
      </div>
    </div>
  )
}
