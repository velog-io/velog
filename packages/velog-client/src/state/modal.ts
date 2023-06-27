import { sangte, useSangteActions, useSangteValue } from 'sangte'

type ModalMode = 'register' | 'login' | ''

type ModalState = {
  visible: boolean
  mode: ModalMode
}

const initialState: ModalState = {
  visible: false,
  mode: '',
}

const modalState = sangte(initialState, (prev) => ({
  showModal(mode: ModalMode) {
    if (!mode) return
    prev.mode = mode
    prev.visible = true
  },
  closeModal() {
    prev.mode = ''
    prev.visible = false
  },
}))

export function useModal() {
  const value = useSangteValue(modalState)
  const actions = useSangteActions(modalState)

  return { value, actions }
}
