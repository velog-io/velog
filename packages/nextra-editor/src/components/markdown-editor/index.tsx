import cn from 'clsx'
import { useRef } from 'react'
import { useCodemirror } from './hooks/useCodemirror'
import Toolbar from './toolbar'

const MarkdownEditor = () => {
  const container = useRef<HTMLDivElement>(null)
  const containerHeight = 'calc(100vh - 64px)'
  const { state, view } = useCodemirror(container, {
    autoFocus: true,
    minHeight: '100%',
    maxHeight: '100%',
  })

  return (
    <div className={cn('nx-py-4')}>
      <Toolbar state={state} view={view} container={container} />
      <div className={cn('')}>
        <div
          ref={container}
          style={{ height: containerHeight }}
          suppressHydrationWarning={true}
          suppressContentEditableWarning={true}
        />
      </div>
    </div>
  )
}

export default MarkdownEditor
