import cn from 'clsx'
import { useEffect, useRef } from 'react'
import styles from './markdown-editor.module.css'
import { useCodemirror } from './hooks/useCodemirror'

const MarkdownEditor = () => {
  const container = useRef<HTMLDivElement>(null)
  const containerHeight = 'calc(100vh - 64px)'
  const { value } = useCodemirror(container, {
    autoFocus: true,
    minHeight: '100%',
    maxHeight: '100%',
  })

  return <div ref={container} style={{ height: containerHeight }} />
}

export default MarkdownEditor
