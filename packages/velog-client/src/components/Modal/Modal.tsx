import { useRef } from 'react'
import styles from './Modal.module.css'
import { createPortal } from 'react-dom'
import { isServerSide } from '@/lib/isServerSide'

type Props = {
  children: React.ReactNode
  isVisible: boolean
  onOverlayClick: () => void
}

function Modal({ children, isVisible, onOverlayClick }: Props) {
  const backdropRef = useRef<HTMLDivElement>(null)
  const handleClickBackdrop: React.MouseEventHandler<HTMLDivElement> = (ev) => {
    if (ev.target === backdropRef.current) {
      onOverlayClick?.()
    }
  }

  if (isServerSide) {
    return null
  }

  const modalRoot = document.getElementById('modal-root')
  if (!modalRoot) {
    return null
  }

  if (isVisible) {
    document.body.style.overflow = 'hidden'
    document.body.style.paddingRight = '8px'
  } else {
    document.body.style.overflow = 'auto'
    document.body.style.paddingRight = '0px'
  }

  return isVisible
    ? createPortal(
        <div
          ref={backdropRef}
          className={styles.backdrop}
          onClick={handleClickBackdrop}
        >
          {children}
        </div>,
        modalRoot
      )
    : null
}

export default Modal
