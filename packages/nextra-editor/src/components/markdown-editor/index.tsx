import { useRef } from 'react'
import { useCodemirror } from './hooks/useCodemirror'

const MarkdownEditor = () => {
  const container = useRef<HTMLDivElement>(null)
  const containerHeight = 'calc(100vh - 64px)'
  useCodemirror(container, {
    autoFocus: true,
    minHeight: '100%',
    maxHeight: '100%',
  })

  return <div ref={container} style={{ height: containerHeight }} />
}

export default MarkdownEditor
