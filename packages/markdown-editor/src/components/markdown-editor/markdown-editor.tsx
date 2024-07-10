import { forwardRef, useEffect } from 'react'
import { useCodemirror } from './hooks/useCodemirror'
import { Toolbar } from './toolbar'

export const MarkdownEditor = forwardRef<HTMLDivElement>(({}, container) => {
  const containerHeight = 'calc(100vh - (var(--nextra-navbar-height)))'
  const { state, view } = useCodemirror(container, {
    autoFocus: true,
    minHeight: '100%',
    maxHeight: '100%',
  })

  const onClick = () => {
    console.log('clicked!')
    view?.focus()
  }

  useEffect(() => {
    onClick()
  }, [])

  return (
    <>
      <Toolbar state={state} view={view} />
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
})
