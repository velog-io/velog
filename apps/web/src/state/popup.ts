import { sangte, useSangteActions, useSangteValue } from 'sangte'

type PopupState = {
  isVisible: boolean
  title: string
  message: string
}

const initialState: PopupState = {
  isVisible: false,
  title: '',
  message: '',
}

const popupState = sangte(initialState, (prev) => ({
  open(payload: OpenActionPayload) {
    prev.isVisible = true
    prev.title = payload.title
    prev.message = payload.message
  },
  close() {
    prev.isVisible = false
    prev.title = ''
    prev.message = ''
  },
}))

export function usePopup() {
  const value = useSangteValue(popupState)
  const actions = useSangteActions(popupState)

  return { value, actions }
}

type OpenActionPayload = {
  title: string
  message: string
}
