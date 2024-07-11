import cn from 'clsx'
import { useConfig } from '@/contexts'
import { type ReactElement } from 'react'
import { MDXRemote } from 'next-mdx-remote'
import { getComponents } from '@/mdx-components'
import { useMarkdownEditor } from '@/contexts/markdown-editor'

interface MarkdownPreviewProps {
  height: string
}

export const MarkdownPreview = ({ height }: MarkdownPreviewProps): ReactElement => {
  const config = useConfig()
  const { mdxSource } = useMarkdownEditor()

  if (!mdxSource) {
    return <div>Mdx source Loading...</div>
  }

  return (
    <>
      <div
        id="markdown-editor-preview"
        className={cn(
          'markdown-editor-preview',
          'markdown-editor-scrollbar nx-h-screen nx-overflow-y-auto nx-scroll-smooth nx-break-words',
        )}
        style={{ height }}
      >
        <main className="nx-w-full nx-px-6 ">
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
    </>
  )
}
