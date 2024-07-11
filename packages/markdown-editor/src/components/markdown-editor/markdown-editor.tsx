import cn from 'clsx'
import {  useRef } from 'react'
import { Toolbar } from './toolbar'
import { useCodemirror } from '@/hooks'

interface MarkdownEditorProps {}

export const MarkdownEditor = ({}: MarkdownEditorProps) => {
  const codemirror = useRef<HTMLDivElement | null>(null)
  const { state, view } = useCodemirror(codemirror, {
    autoFocus: true,
    minHeight: '100%',
    maxHeight: '100%',
  })

  const onClick = () => {
    view?.focus()
  }

  return (
    <>
      <Toolbar state={state} view={view} />
      <div
        className={cn('markdown-editor-codemirror')}
        onClick={onClick}
        ref={codemirror}
        suppressHydrationWarning={true}
        suppressContentEditableWarning={true}
        style={{
          height:
            'calc(100vh - (var(--nextra-navbar-height)) - var(--nextra-editor-toolbar-height))',
        }}
      />
    </>
  )
}
