import { useCallback, useEffect, useRef, useState } from 'react'
import styles from './Modal.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {
  children: React.ReactNode
  isVisible: boolean
  onOverlayClick: VoidFunction
}

function Modal({ children, isVisible, onOverlayClick }: Props) {
  const [closed, setClosed] = useState(true)
  const backdropRef = useRef<HTMLDivElement>(null)

  const handleClickBackdrop: React.MouseEventHandler<HTMLDivElement> = useCallback(
    (ev) => {
      if (ev.target === backdropRef.current) {
        onOverlayClick?.()
      }
    },
    [onOverlayClick]
  )
  // TODO: Using React.Potal
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null
    if (isVisible) {
      setClosed(false)
    } else {
      timeoutId = setTimeout(() => {
        setClosed(true)
      }, 200)
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [isVisible])

  if (!isVisible && closed) return null
  return (
    <div
      ref={backdropRef}
      className={cx('backdrop', isVisible ? 'fadeIn' : 'fadeOut')}
      onClick={handleClickBackdrop}
    >
      {children}
    </div>
  )
}

export default Modal
