import cn from 'clsx'
import { useConfig } from '@/contexts'
import { useMounted } from '@/nextra/hooks'
import type { PageTheme } from '@/nextra/normalize-pages'
import type { ReactNode, ReactElement } from 'react'
import { renderComponent } from '@/utils'
import { MDXRemote } from 'next-mdx-remote'
import { getComponents } from '@/mdx-components'
import { useMarkdownEditor } from '@/contexts/markdown-editor'

interface MarkdownPreviewProps {
  themeContext: PageTheme
  breadcrumb: ReactNode
  timestamp?: number
  navigation: ReactNode
  children?: ReactNode
}

const classes = {
  toc: cn('nextra-toc nx-order-last nx-hidden nx-w-64 nx-shrink-0 xl:nx-block print:nx-hidden'),
  main: cn('nextra-scrollbar nx-break-words nx-h-screen nx-overflow-y-auto'),
}

export const MarkdownPreview = ({
  themeContext,
  navigation,
  children,
}: MarkdownPreviewProps): ReactElement => {
  const config = useConfig()
  const isMount = useMounted()
  const { mdxSource } = useMarkdownEditor()

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

  if (!mdxSource) {
    return <div>Mdx source Loading...</div>
  }

  const content = (
    <>
      <MDXRemote
        compiledSource={mdxSource.compiledSource}
        frontmatter={mdxSource.frontmatter}
        scope={mdxSource.scope}
        components={getComponents({
          isRawLayout: false,
          components: config.components,
        })}
      />
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
