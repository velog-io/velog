import cn from 'clsx'
import { forwardRef, useEffect, useRef } from 'react'

import { Toolbar } from './toolbar'
import { ReactCodeMirrorRef } from '@/types'
import { Extension } from '@codemirror/state'
import { useCodemirror } from '@/hooks'

interface MarkdownEditorProps {
  codeMirrorExtensions?: Extension[]
}

export const MarkdownEditor = forwardRef<ReactCodeMirrorRef, MarkdownEditorProps>(
  ({ codeMirrorExtensions = [] }, editorRef) => {
    const codemirror = useRef<HTMLDivElement | null>(null)
    const { state, view } = useCodemirror(codemirror, {
      autoFocus: true,
      minHeight: '100%',
      maxHeight: '100%',
      extension: codeMirrorExtensions,
    })

    useEffect(() => {
      if (!codemirror.current) return
      if (!view || !state) return
      if (typeof editorRef === 'function') {
        editorRef({ editor: codemirror.current, view, state })
      } else if (editorRef && 'current' in editorRef) {
        editorRef.current = {
          editor: codemirror.current,
          view,
          state,
        }
      }
    }, [editorRef, view, state])

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
  },
)
