import { createContext, type ReactNode, useContext, useState } from 'react'

export type ModalMode = 'deleteSortableItem'

interface Modal {
  isOpen: boolean
  setIsOpen: (value: boolean) => void
  mode: ModalMode | null
  setMode: (value: ModalMode | null) => void
  onOpen: (type: ModalMode) => void
  onClose: () => void
}

const ModalContext = createContext<Modal>({
  isOpen: false,
  setIsOpen: () => {},
  mode: null,
  setMode: () => {},
  onOpen: () => {},
  onClose: () => {},
})

export function useModal() {
  return useContext(ModalContext)
}

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [mode, setMode] = useState<ModalMode | null>(null)

  const onOpen = (mode: ModalMode) => {
    setIsOpen(true)
    setMode(mode)
  }

  const onClose = () => {
    setIsOpen(false)
    setMode(null)
  }

  const value: Modal = {
    isOpen,
    setIsOpen,
    mode,
    setMode,
    onOpen,
    onClose,
  }

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
}
