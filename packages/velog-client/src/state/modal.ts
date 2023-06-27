import { sangte, useSangteActions, useSangteValue } from 'sangte'

export type ModalMode = 'register' | 'login' | ''

type ModalState = {
  isVisible: boolean
  mode: ModalMode
}

const initialState: ModalState = {
  isVisible: true,
  mode: 'login',
}

const modalState = sangte(initialState, (prev) => ({
  showModal(mode: ModalMode) {
    if (!mode) return
    prev.mode = mode
    prev.isVisible = true
  },
  closeModal() {
    prev.mode = ''
    prev.isVisible = false
  },
}))

export function useModal() {
  const value = useSangteValue(modalState)
  const actions = useSangteActions(modalState)

  return { value, actions }
}
