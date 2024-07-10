import cn from 'clsx'
import { useConfig } from '@/contexts'
import type { ReactElement } from 'react'
import { MDXRemote } from 'next-mdx-remote'
import { getComponents } from '@/mdx-components'
import { useMarkdownEditor } from '@/contexts/markdown-editor'

interface MarkdownPreviewProps {}

export const MarkdownPreview = ({}: MarkdownPreviewProps): ReactElement => {
  const config = useConfig()
  const { mdxSource } = useMarkdownEditor()

  if (!mdxSource) {
    return <div>Mdx source Loading...</div>
  }

  const content = (
    <MDXRemote
      compiledSource={mdxSource.compiledSource}
      frontmatter={mdxSource.frontmatter}
      scope={mdxSource.scope}
      components={getComponents({
        isRawLayout: false,
        components: config.components,
      })}
    />
  )

  const body = config.main?.({ children: content }) || content
  return (
    <article
      className={cn('nextra-scrollbar nx-mt-[-24px] nx-h-screen nx-overflow-y-auto nx-break-words')}
    >
      <main className="nx-mt-6 nx-w-full nx-min-w-0 nx-max-w-6xl nx-px-6 nx-pt-6">{body}</main>
    </article>
  )
}
