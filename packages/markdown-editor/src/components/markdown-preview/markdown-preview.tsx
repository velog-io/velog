import cn from 'clsx'
import { useConfig } from '@/contexts'
import { useEffect, useRef, useState, type ReactElement } from 'react'
import { MDXRemote } from 'next-mdx-remote'
import { getComponents } from '@/mdx-components'
import { useMarkdownEditor } from '@/contexts/markdown-editor'
import { throttle } from 'throttle-debounce'

interface MarkdownPreviewProps {}

export const MarkdownPreview = ({}: MarkdownPreviewProps): ReactElement => {
  const config = useConfig()

  const { mdxSource, setActive, active } = useMarkdownEditor()
  const preview = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = throttle(150, (event: Event) => {
      if (active !== 'preview') return
      if (!preview.current) return
      if (!event.target) return

      const editor = document.querySelector('.cm-scroller')
      if (!editor) return

      const editorScrollHeight = editor.scrollHeight - editor.clientHeight
      const previewScrollHeight = preview.current.scrollHeight - preview.current.clientHeight
      const percent = preview.current.scrollTop / previewScrollHeight
      editor.scrollTop = percent * editorScrollHeight
    })

    if (!preview.current) return
    preview.current.addEventListener('scroll', onScroll)

    return () => {
      if (!preview.current) return
      preview.current.removeEventListener('scroll', onScroll)
    }
  }, [preview.current, active])

  const onMouseOver = throttle(200, () => {
    setActive('preview')
  })

  const onMouseLeave = throttle(200, () => {
    setActive('editor')
  })

  useEffect(() => {
    if (!preview.current) return
    preview.current.addEventListener('mouseover', onMouseOver)
    preview.current.addEventListener('mouseleave', onMouseLeave)

    return () => {
      if (!preview.current) return
      preview.current.removeEventListener('mouseover', onMouseOver)
      preview.current.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [preview.current])

  return (
    <div
      ref={preview}
      id="markdown-editor-preview"
      className={cn(
        'markdown-editor-preview',
        'markdown-editor-scrollbar nx-h-screen nx-overflow-y-auto nx-scroll-smooth nx-break-words',
      )}
      style={{ height: '100%', paddingBottom: '10rem' }}
    >
      {!mdxSource && <div>Mdx source Loading...</div>}
      {mdxSource && (
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
      )}
    </div>
  )
}
