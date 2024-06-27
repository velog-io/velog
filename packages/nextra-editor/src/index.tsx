import type { ReactElement, ReactNode } from 'react'
import { useMemo } from 'react'
import 'focus-visible'
import cn from 'clsx'
import './polyfill'
import { Banner, Breadcrumb, Head, Header, NavLinks, Sidebar } from './components'
import { DEFAULT_LOCALE, PartialDocsThemeConfig } from './constants'
import { ActiveAnchorProvider, ConfigProvider, useConfig } from './contexts'
import { getComponents } from './mdx-components'
import { renderComponent } from './utils'
import { MDXRemote } from 'next-mdx-remote'
import theme from './theme.json'
import { normalizePages, PageTheme } from './nextra/normalize-pages'
import { useFSRoute } from './nextra/hooks/use-fs-route'
import { NextraThemeLayoutProps, PageOpts } from './nextra/types'
import { useMounted } from './nextra/hooks'
import { SidebarProvider } from './contexts/sidebar'
import MarkdownEditor from './components/markdown-editor'
import { MarkdownEditorProvider, useMarkdownEditor } from './contexts/markdown-editor'
import { CustomEventDetail, MdxCompilerOptions, MdxOptions, SearchResult } from './types'
interface BodyProps {
  themeContext: PageTheme
  breadcrumb: ReactNode
  timestamp?: number
  navigation: ReactNode
  children: ReactNode
}

const classes = {
  toc: cn('nextra-toc nx-order-last nx-hidden nx-w-64 nx-shrink-0 xl:nx-block print:nx-hidden'),
  main: cn('nextra-scrollbar nx-break-words nx-h-screen nx-overflow-y-auto'),
}

const Body = ({ themeContext, navigation, children }: BodyProps): ReactElement => {
  const config = useConfig()
  const isMount = useMounted()

  if (themeContext.layout === 'raw') {
    return <div className={classes.main}>{children}</div>
  }

  const date = new Date()

  const gitTimestampEl =
    // Because a user's time zone may be different from the server page
    isMount && date ? (
      <div className="nx-mb-8 nx-mt-12 nx-block nx-text-xs nx-text-gray-500 dark:nx-text-gray-400 ltr:nx-text-right rtl:nx-text-left">
        {renderComponent(config.gitTimestamp, { timestamp: date })}
      </div>
    ) : (
      <div className="nx-mt-16" />
    )

  const content = (
    <>
      {children}
      {gitTimestampEl}
      {navigation}
    </>
  )

  const body = config.main?.({ children: content }) || content

  // if (themeContext.layout === 'full') {
  //   return (
  //     <article
  //       className={cn(
  //         classes.main,
  //         'nextra-content nx-min-h-[calc(100vh-var(--nextra-navbar-height))] nx-pl-[max(env(safe-area-inset-left),1.5rem)] nx-pr-[max(env(safe-area-inset-right),1.5rem)]',
  //       )}
  //     >
  //       {body}
  //     </article>
  //   )
  // }

  return (
    <article
      className={cn(
        classes.main,
        // 'nextra-content nx-flex nx-min-h-[calc(100vh-var(--nextra-navbar-height))] nx-min-w-0 nx-justify-center nx-pb-8 nx-pr-[calc(env(safe-area-inset-right)-1.5rem)]',
        // themeContext.typesetting === 'article' && 'nextra-body-typesetting-article',
        // 'nextra-content nx-max-h-[calc(100vh-var(--nextra-navbar-height))]',
      )}
      style={{ marginTop: '-24px' }}
    >
      <main
        className="nx-w-full nx-min-w-0 nx-max-w-6xl nx-px-6"
        style={{ marginTop: '24px', paddingTop: '24px' }}
      >
        {/* {breadcrumb} */}
        {body}
      </main>
    </article>
  )
}

type InnerLayoutProps = PageOpts & {
  children: ReactNode
}

const InnerLayout = ({
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

type NextraDocLayoutProps = NextraThemeLayoutProps & {
  editorValue: string
}

export default function NextraDocLayout({
  children,
  editorValue,
  ...context
}: NextraDocLayoutProps): ReactElement {
  return (
    <ConfigProvider value={context}>
      <MarkdownEditorProvider value={{ editorValue }}>
        <SidebarProvider>
          <InnerLayout {...context.pageOpts}>{children}</InnerLayout>
        </SidebarProvider>
      </MarkdownEditorProvider>
    </ConfigProvider>
  )
}

export { useConfig, type PartialDocsThemeConfig as DocsThemeConfig, theme }
export { Callout, Steps, Tabs, Tab, Cards, Card, FileTree } from './nextra/components'
export { useTheme } from 'next-themes'
export { Link } from './mdx-components'
export type { Item, PageItem } from './nextra/normalize-pages'
export type { Heading, PageMapItem, PageOpts, MetaJsonFile, Folder, MdxFile } from './nextra/types'
export {
  Bleed,
  Collapse,
  NotFoundPage,
  ServerSideErrorPage,
  Header,
  Sidebar,
  SkipNavContent,
  SkipNavLink,
  ThemeSwitch,
  LocaleSwitch,
} from './components'

export const nextraCustomEventName: Record<keyof CustomEventDetail, string> = {
  addActionEvent: 'addActionEvent',
  changeItemEvent: 'changeItemEvent',
  saveItemBodyEvent: 'saveItemBodyEvent',
  deployStartEvent: 'deployStartEvent',
  deployEndEvent: 'deployEndEvent',
}

export { CustomEventDetail, MdxCompilerOptions, MdxOptions, SearchResult }

export {
  attachMeta,
  parseMeta,
  remarkCustomHeadingId,
  remarkHeadings,
  remarkLinkRewrite,
  remarkMdxDisableExplicitJsx,
  remarkRemoveImports,
  remarkReplaceImports,
  remarkStaticImage,
  remarkStructurize,
} from './nextra/mdx-plugins'
export { mdxCompiler } from './mdx-compiler'
