import { sangte, useSangteActions, useSangteValue } from 'sangte'

export type AuthMode = 'register' | 'login'
export type ModalMode = AuthMode | ''

type ModalState = {
  isVisible: boolean
  mode: ModalMode
  redirectPath: string | null
}

const initialState: ModalState = {
  isVisible: false,
  mode: '',
  redirectPath: null,
}

const modalState = sangte(initialState, (prev) => ({
  showModal(mode: ModalMode, redirectPath?: string) {
    prev.mode = mode
    prev.isVisible = true
    prev.redirectPath = redirectPath || null
  },
  closeModal() {
    prev.mode = ''
    prev.isVisible = false
    prev.redirectPath = null
  },
  changeMode(mode: ModalMode) {
    prev.mode = mode
  },
}))

export function useModal() {
  const value = useSangteValue(modalState)
  const actions = useSangteActions(modalState)

  return { value, actions }
}
