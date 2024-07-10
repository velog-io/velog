import cn from 'clsx'
import { useConfig } from '@/contexts'
import { forwardRef, type ReactElement } from 'react'
import { MDXRemote } from 'next-mdx-remote'
import { getComponents } from '@/mdx-components'
import { useMarkdownEditor } from '@/contexts/markdown-editor'

interface MarkdownPreviewProps {}

export const MarkdownPreview = forwardRef<HTMLDivElement, MarkdownPreviewProps>(
  (props, ref): ReactElement => {
    const config = useConfig()
    const { mdxSource } = useMarkdownEditor()

    if (!mdxSource) {
      return <div>Mdx source Loading...</div>
    }

    return (
      <div
        ref={ref}
        className={cn(
          'markdown-editor-preview',
          'markdown-editor-scrollbar nx-h-screen nx-overflow-y-auto nx-break-words nx-pb-16',
        )}
      >
        <main className="nx-mt-6 nx-w-full nx-min-w-0 nx-max-w-6xl nx-px-6 nx-pb-12 nx-pt-6">
          <MDXRemote
            compiledSource={mdxSource.compiledSource}
            frontmatter={mdxSource.frontmatter}
            scope={mdxSource.scope}
            components={getComponents({
              isRawLayout: false,
              components: config.components,
            })}
          />
        </main>
      </div>
    )
  },
)
