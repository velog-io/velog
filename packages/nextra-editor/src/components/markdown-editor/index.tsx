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

  const onClick = () => {
    view?.focus()
  }

  return (
    <>
      <Toolbar state={state} view={view} container={container} />
      <div onClick={onClick}>
        <div
          ref={container}
          style={{ height: containerHeight }}
          suppressHydrationWarning={true}
          suppressContentEditableWarning={true}
        />
      </div>
    </>
  )
}

export default MarkdownEditor
