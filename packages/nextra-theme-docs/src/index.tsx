import type { ReactElement, ReactNode } from 'react'
import { useMemo } from 'react'
import 'focus-visible'
import cn from 'clsx'
import './polyfill'
import { Banner, Breadcrumb, Head, NavLinks, Sidebar } from './components'
import { DEFAULT_LOCALE, PartialDocsThemeConfig } from './constants'
import { ActiveAnchorProvider, ConfigProvider, useConfig } from './contexts'
import { getComponents } from './mdx-components'
import { renderComponent } from './utils'
import { MDXRemote, type MDXRemoteSerializeResult } from 'next-mdx-remote'
import type { ProcessorOptions } from '@mdx-js/mdx'
import theme from './theme.json'
import { normalizePages, PageTheme } from './nextra/normalize-pages'
import { useFSRoute } from './nextra/hooks/use-fs-route'
import { LoaderOptions, NextraThemeLayoutProps, PageOpts } from './nextra/types'
import { useMounted } from './nextra/hooks'
interface BodyProps {
  themeContext: PageTheme
  breadcrumb: ReactNode
  timestamp?: number
  navigation: ReactNode
  children: ReactNode
}

const classes = {
  toc: cn('nextra-toc nx-order-last nx-hidden nx-w-64 nx-shrink-0 xl:nx-block print:nx-hidden'),
  main: cn('nx-w-full nx-break-words'),
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
      <div className="nx-mt-12 nx-mb-8 nx-block nx-text-xs nx-text-gray-500 ltr:nx-text-right rtl:nx-text-left dark:nx-text-gray-400">
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
        'nextra-content nx-min-h-[calc(100vh-var(--nextra-navbar-height))] nx-pl-[max(env(safe-area-inset-left),1.5rem)] nx-pr-[max(env(safe-area-inset-right),1.5rem)]',
      )}
    >
      <main className="nx-w-full nx-min-w-0 nx-max-w-6xl nx-px-6 nx-pt-4">
        {/* {breadcrumb} */}
        {body}
      </main>
    </article>
  )
}

const InnerLayout = ({
  pageMap,
  frontMatter,
  headings,
  children,
  mdxSource,
  editorValue,
  onEditorChange,
}: PageOpts & {
  children: ReactNode
  mdxSource: MDXRemoteSerializeResult
  editorValue: string
  onEditorChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}): ReactElement => {
  const config = useConfig()
  const fsPath = useFSRoute()

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
  return (
    <div dir={direction} className={cn('nx-overflow-hidden')}>
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.setAttribute('dir','${direction}')`,
        }}
      />
      <Head />
      <Banner />
      {themeContext.navbar &&
        renderComponent(config.navbar.component, {
          flatDirectories,
          items: topLevelNavbarItems,
        })}
      <div
        className={cn('nx-mx-auto nx-flex', themeContext.layout === 'raw' && 'nx-max-w-[90rem]')}
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
          <div className={cn('nx-flex nx-w-full')}>
            <div
              className={cn('sm:nx-hidden nx-overflow-y-auto nx-mt-4')}
              style={{ flex: 1, height: '100vh' }}
            >
              <div className={cn('nx-container nx-w-full nx-bg-white nx-max-h-screen')}>
                <textarea
                  className={cn('nx-w-full nx-max-h-screen nx-pl-6 nx-pr-6 nx-outline-none')}
                  defaultValue={editorValue}
                  onChange={onEditorChange}
                  minLength={10000}
                  style={{ height: '2000px', outline: 'none' }}
                />
              </div>
            </div>
            <div className={cn('nx-overflow-y-auto')} style={{ flex: 1, height: '100vh' }}>
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
  mdxSource: MDXRemoteSerializeResult
  editorValue: string
  onEditorChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}

export default function NextraDocLayout({
  children,
  mdxSource,
  editorValue,
  onEditorChange,
  ...context
}: NextraDocLayoutProps): ReactElement {
  return (
    <ConfigProvider value={context}>
      <InnerLayout
        {...context.pageOpts}
        mdxSource={mdxSource}
        editorValue={editorValue}
        onEditorChange={onEditorChange}
      >
        {children}
      </InnerLayout>
    </ConfigProvider>
  )
}

export { useConfig, type PartialDocsThemeConfig as DocsThemeConfig, theme }
export { Callout, Steps, Tabs, Tab, Cards, Card, FileTree } from './nextra/components'
export { useTheme } from 'next-themes'
export { Link } from './mdx-components'
export type { Item, PageItem } from './nextra/normalize-pages'
export type { Heading, PageMapItem, PageOpts } from './nextra/types'
export {
  Bleed,
  Collapse,
  NotFoundPage,
  ServerSideErrorPage,
  Navbar,
  Sidebar,
  SkipNavContent,
  SkipNavLink,
  ThemeSwitch,
  LocaleSwitch,
} from './components'

// for compiler
export type MdxOptions = LoaderOptions['mdxOptions'] &
  Pick<ProcessorOptions, 'jsx' | 'outputFormat'>
export type MdxCompilerOptions = Partial<
  Pick<
    LoaderOptions,
    'staticImage' | 'flexsearch' | 'defaultShowCopyCode' | 'readingTime' | 'latex' | 'codeHighlight'
  > & {
    mdxOptions?: MdxOptions
    route?: string
    locale?: string
    filePath?: string
    useCachedCompiler?: boolean
    isPageImport?: boolean
  }
>

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
