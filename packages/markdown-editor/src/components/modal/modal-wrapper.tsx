import { useCallback, useEffect, useRef, useState } from 'react'
import cn from 'clsx'

type Props = {
  children: React.ReactNode
  isVisible: boolean
  onOverlayClick: VoidFunction
}

const style = {
  backdrop: cn(
    'nx-fixed nx-inset-0 nx-w-[100vw] nx-h-[100svh] nx-bg-[var(--opaque-layer)] nx-z-10 nx-flex nx-items-center nx-justify-center',
  ),
}

export function ModalWrapper({ children, isVisible, onOverlayClick }: Props) {
  const [isClosed, setIsClosed] = useState(false)
  const backdropRef = useRef<HTMLDivElement>(null)
  const timeoutId = useRef<NodeJS.Timeout | null>(null)

  const handleClickBackdrop: React.MouseEventHandler<HTMLDivElement> = useCallback(
    (ev) => {
      if (ev.target === backdropRef.current) {
        onOverlayClick?.()
      }
    },
    [onOverlayClick],
  )

  // TODO: Using React.Potal
  useEffect(() => {
    if (isVisible) {
      setIsClosed(false)
    } else {
      timeoutId.current = setTimeout(() => {
        setIsClosed(true)
      }, 100)
    }
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current)
      }
    }
  }, [isVisible])

  if (!isVisible && isClosed) return null
  return (
    <div
      ref={backdropRef}
      className={cn(style.backdrop, isVisible ? 'fadeIn' : 'fadeOut')}
      onClick={handleClickBackdrop}
    >
      {children}
    </div>
  )
}
