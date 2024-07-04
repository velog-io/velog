import React, { useEffect, useState } from 'react'
import ModalShadow from './modal-shadow'

interface ModalWrapperProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({ isOpen, onClose, children }) => {
  const [isVisible, setIsVisible] = useState(isOpen)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    } else {
      setTimeout(() => setIsVisible(false), 300) // 애니메이션 시간이 300ms라고 가정
    }
  }, [isOpen])

  if (!isVisible) return null

  return (
    <div className="nx-fixed nx-inset-0 nx-z-50 nx-flex nx-items-center nx-justify-center">
      <ModalShadow isOpen={isOpen} onClose={onClose} />
      <div
        className={`nx-z-50 nx-transform nx-rounded nx-bg-white nx-p-8 nx-shadow-lg nx-transition-transform ${isOpen ? 'nx-translate-y-0' : 'nx-translate-y-full'}`}
      >
        {children}
      </div>
    </div>
  )
}

export default ModalWrapper
