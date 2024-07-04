import cn from 'clsx'
import type { CSSProperties, ReactNode } from 'react'
import { useEffect, useRef } from 'react'
import { useDndTree } from './sidebar/sortable-tree'

type CollapseProps = {
  children: ReactNode
  className?: string
  isOpen: boolean
  horizontal?: boolean
  style?: CSSProperties
}

export function Collapse({
  children,
  className,
  isOpen,
  horizontal = false,
  style,
}: CollapseProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef(0)
  const initialOpen = useRef(isOpen)
  const initialRender = useRef(true)
  const { isDragging } = useDndTree()

  useEffect(() => {
    const container = containerRef.current
    const inner = innerRef.current
    const animation = animationRef.current
    if (animation) {
      clearTimeout(animation)
    }
    if (initialRender.current || !container || !inner) return

    container.classList.toggle('nx-duration-500', !isOpen)
    container.classList.toggle('nx-duration-300', isOpen)

    if (horizontal) {
      // save initial width to avoid word wrapping when container width will be changed
      inner.style.width = `100%`
      container.style.width = `100%`
    } else {
      container.style.height = `${inner.clientHeight}px`
    }

    if (isOpen) {
      animationRef.current = window.setTimeout(() => {
        // should be style property in kebab-case, not css class name
        container.style.removeProperty('height')
      }, 300)
    } else {
      setTimeout(() => {
        if (horizontal) {
          container.style.width = '0px'
        } else {
          container.style.height = '0px'
        }
      }, 0)
    }
  }, [horizontal, isOpen])

  useEffect(() => {
    initialRender.current = false
  }, [])

  return (
    <div
      ref={containerRef}
      className={cn(
        'nx-transform-gpu nx-transition-all nx-ease-in-out motion-reduce:nx-transition-none',
        isDragging ? '' : 'nx-overflow-hidden',
      )}
      style={initialOpen.current || horizontal ? { ...style } : { height: 0, ...style }}
    >
      <div
        ref={innerRef}
        className={cn(
          'nx-transition-opacity nx-duration-500 nx-ease-in-out motion-reduce:nx-transition-none',
          isOpen ? 'nx-opacity-100' : 'nx-opacity-0',
          className,
        )}
      >
        {children}
      </div>
    </div>
  )
}
