import { createContext, type ReactNode, useContext, useEffect, useRef, useState } from 'react'

export type ModalMode = 'deleteSortableItem'

interface Modal {
  isOpen: boolean
  setIsOpen: (value: boolean) => void
  mode: ModalMode | null
  setMode: (value: ModalMode | null) => void
  onOpen: (type: ModalMode) => void
  onClose: () => void
  isConfirm: boolean
  setIsConfirm: (value: boolean) => void
}

const ModalContext = createContext<Modal>({
  isOpen: false,
  setIsOpen: () => {},
  mode: null,
  setMode: () => {},
  onOpen: () => {},
  onClose: () => {},
  isConfirm: false,
  setIsConfirm: () => {},
})

export function useModal() {
  return useContext(ModalContext)
}

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [mode, setMode] = useState<ModalMode | null>(null)
  const [isConfirm, setIsConfirm] = useState<boolean>(false)
  const timer = useRef<NodeJS.Timeout | null>(null)

  useEffect(
    () => () => {
      if (timer.current) {
        clearTimeout(timer.current)
      }
    },
    [],
  )
  const onOpen = (mode: ModalMode) => {
    setIsOpen(true)
    setMode(mode)
  }

  const onClose = () => {
    timer.current = setTimeout(() => {
      setIsOpen(false)
      setMode(null)
      setIsConfirm(false)
    }, 100)
  }

  const value: Modal = {
    isOpen,
    setIsOpen,
    mode,
    setMode,
    onOpen,
    onClose,
    isConfirm,
    setIsConfirm,
  }

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
}
