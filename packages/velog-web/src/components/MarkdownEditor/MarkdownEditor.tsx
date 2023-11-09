'use client'

import style from './MarkdownEditor.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import CodeMirror, { EditorFromTextArea, Editor } from 'codemirror'
import './styles/custom-code-mirror.css'
import './styles/atom-one-light.module.css'
import './styles/atom-one-dark.module.css'
import 'codemirror/lib/codemirror.css'

import 'codemirror/mode/markdown/markdown'
import 'codemirror/addon/display/placeholder'

import { useTheme } from '@/state/theme'
import { CSSProperties, useCallback, useEffect, useRef } from 'react'

const cx = bindClassNames(style)

type Props = {
  style?: CSSProperties
  className?: string
  onChangeMarkdown: (markdown: string) => void
  initialMarkdown?: string
}

function MarkdownEditor({ style, className, onChangeMarkdown, initialMarkdown }: Props) {
  const textArea = useRef<HTMLTextAreaElement | null>(null)
  const codemirror = useRef<EditorFromTextArea | null>(null)

  const onChange = useCallback(
    (cm: Editor) => {
      onChangeMarkdown(cm.getValue())
    },
    [onChangeMarkdown],
  )

  const { theme } = useTheme()

  useEffect(() => {
    if (!textArea.current) return
    const cm = CodeMirror.fromTextArea(textArea.current, {
      mode: 'markdown',
      theme: `one-${theme}`,
      placeholder: '당신은 어떤 사람인가요? 당신에 대해서 알려주세요.',
      lineWrapping: true,
    })
    codemirror.current = cm
    cm.focus()
    cm.on('change', onChange)

    if (initialMarkdown) {
      cm.setValue(initialMarkdown)
    }

    return () => {
      cm.toTextArea()
    }
  }, [initialMarkdown, onChange, theme])

  return (
    <div className={cx('block', className)} style={style}>
      <textarea ref={textArea} style={{ border: 'none', display: 'none' }} />
    </div>
  )
}

export default MarkdownEditor
