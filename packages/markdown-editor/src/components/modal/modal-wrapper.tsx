import { useCallback, useEffect, useRef, useState } from 'react'
import cn from 'clsx'

type Props = {
  children: React.ReactNode
  isVisible: boolean
  onOverlayClick: VoidFunction
}

export function ModalWrapper({ children, isVisible, onOverlayClick }: Props) {
  const [isClosed, setIsClosed] = useState(false)
  const backdropRef = useRef<HTMLDivElement>(null)
  const timeoutId = useRef<NodeJS.Timeout | null>(null)

  const onBackdropClick: React.MouseEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      if (event.target === backdropRef.current) {
        onOverlayClick?.()
      }
    },
    [onOverlayClick],
  )

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
      onClick={onBackdropClick}
      className={cn(
        'nx-fixed nx-inset-0 nx-z-10 nx-flex nx-h-[100svh] nx-w-[100vw] nx-items-center nx-justify-center nx-bg-[var(--opaque-layer)]',
        isVisible ? 'fadeIn' : 'fadeOut',
      )}
    >
      {children}
    </div>
  )
}
