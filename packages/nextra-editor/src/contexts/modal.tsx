import * as React from 'react'
import { createContext, ReactNode, useContext, useState } from 'react'

type ModalType = 'deleteItem'

interface Modal {
  isModalOpen: boolean
  setIsModalOpen: (value: boolean) => void
  modalType: ModalType | null
  setModalType: (value: ModalType | null) => void
  reset: () => void
}

const ModalContext = createContext<Modal>({
  isModalOpen: false,
  setIsModalOpen: () => {},
  modalType: null,
  setModalType: () => {},
  reset: () => {},
})

export function useModal() {
  return useContext(ModalContext)
}

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [modalType, setModalType] = useState<ModalType | null>(null)

  const reset = () => {
    setIsModalOpen(false)
    setModalType(null)
  }

  const value: Modal = {
    isModalOpen,
    setIsModalOpen,
    modalType,
    setModalType,
    reset,
  }

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
}
