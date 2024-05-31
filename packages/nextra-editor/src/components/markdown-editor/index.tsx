import cn from 'clsx'
import { useRef } from 'react'
import { useCodemirror } from './hooks/useCodemirror'
import Toolbar from './toolbar'

const MarkdownEditor = () => {
  const container = useRef<HTMLDivElement>(null)
  const containerHeight = 'calc(100vh - 64px)'
  useCodemirror(container, {
    autoFocus: true,
    minHeight: '100%',
    maxHeight: '100%',
  })

  return (
    <div>
      <Toolbar />
      <div className={cn('nx-py-4')}>
        <div ref={container} style={{ height: containerHeight }} />
      </div>
    </div>
  )
}

export default MarkdownEditor
