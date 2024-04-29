import type { NextraThemeLayoutProps, PageOpts } from 'nextra'
import type { ReactElement, ReactNode } from 'react'
import { useMemo } from 'react'
import 'focus-visible'
import cn from 'clsx'
import { useFSRoute, useMounted } from 'nextra/hooks'

import './polyfill'
import type { PageTheme } from 'nextra/normalize-pages'
import { normalizePages } from 'nextra/normalize-pages'
import { Banner, Breadcrumb, Head, NavLinks, Sidebar } from './components'
import { DEFAULT_LOCALE, PartialDocsThemeConfig } from './constants'
import { ActiveAnchorProvider, ConfigProvider, useConfig } from './contexts'
import { getComponents } from './mdx-components'
import { renderComponent } from './utils'
import { MDXRemote, type MDXRemoteSerializeResult } from 'next-mdx-remote'

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

const Body = ({
  themeContext,
  breadcrumb,
  timestamp,
  navigation,
  children,
}: BodyProps): ReactElement => {
  const config = useConfig()
  const mounted = useMounted()

  if (themeContext.layout === 'raw') {
    return <div className={classes.main}>{children}</div>
  }

  const date = new Date()

  const gitTimestampEl =
    // Because a user's time zone may be different from the server page
    date ? (
      <div className="nx-mt-12 nx-mb-8 nx-block nx-text-xs nx-text-gray-500 ltr:nx-text-right rtl:nx-text-left dark:nx-text-gray-400">
        {renderComponent(config.gitTimestamp, { timestamp: date })}
      </div>
    ) : (
      <div className="nx-mt-16">nothing???</div>
    )

  const content = (
    <>
      {children}
      {gitTimestampEl}
      {navigation}
    </>
  )

  const body = config.main?.({ children: content }) || content

  if (themeContext.layout === 'full') {
    return (
      <article
        className={cn(
          classes.main,
          'nextra-content nx-min-h-[calc(100vh-var(--nextra-navbar-height))] nx-pl-[max(env(safe-area-inset-left),1.5rem)] nx-pr-[max(env(safe-area-inset-right),1.5rem)]',
        )}
      >
        {body}
      </article>
    )
  }

  return (
    <article
      className={cn(
        classes.main,
        'nextra-content nx-flex nx-min-h-[calc(100vh-var(--nextra-navbar-height))] nx-min-w-0 nx-justify-center nx-pb-8 nx-pr-[calc(env(safe-area-inset-right)-1.5rem)]',
        themeContext.typesetting === 'article' && 'nextra-body-typesetting-article',
      )}
    >
      <main className="nx-w-full nx-min-w-0 nx-max-w-6xl nx-px-6 nx-pt-4 md:nx-px-12">
        {breadcrumb}
        {body}
      </main>
    </article>
  )
}

const InnerLayout = ({
  pageMap,
  frontMatter,
  headings,
  timestamp,
  children,
  mdxSource,
}: PageOpts & { children: ReactNode; mdxSource: MDXRemoteSerializeResult }): ReactElement => {
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
        route: fsPath,
      }),
    [pageMap, fsPath],
  )

  const themeContext = { ...activeThemeContext, ...frontMatter }
  const direction = config.direction === 'rtl' ? 'rtl' : 'ltr'
  return (
    <div dir={direction}>
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
        className={cn('nx-mx-auto nx-flex', themeContext.layout !== 'raw' && 'nx-max-w-[90rem]')}
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
              {...mdxSource}
              components={getComponents({
                isRawLayout: themeContext.layout === 'raw',
                components: config.components,
              })}
            />
            {children}
          </Body>
        </ActiveAnchorProvider>
      </div>
    </div>
  )
}

export default function NextraDocLayout({
  children,
  mdxSource,
  ...context
}: NextraThemeLayoutProps): ReactElement {
  return (
    <ConfigProvider value={context}>
      <InnerLayout {...context.pageOpts} mdxSource={mdxSource}>
        {children}
      </InnerLayout>
    </ConfigProvider>
  )
}

export { useConfig, PartialDocsThemeConfig as DocsThemeConfig }
export { useMDXComponents } from 'nextra/mdx'
export { Callout, Steps, Tabs, Tab, Cards, Card, FileTree } from 'nextra/components'
export { useTheme } from 'next-themes'
export { Link } from './mdx-components'
export { Item, PageItem } from 'nextra/normalize-pages'
export { Heading } from 'nextra'
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
export { PageMapItem, PageOpts } from 'nextra'
