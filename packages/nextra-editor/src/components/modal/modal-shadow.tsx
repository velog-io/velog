import React from 'react'

interface ModalShadowProps {
  isOpen: boolean
  onClose: () => void
}

const ModalShadow: React.FC<ModalShadowProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null
  return <div className="nx-fixed nx-inset-0 nx-bg-black nx-opacity-50" onClick={onClose}></div>
}

export default ModalShadow
