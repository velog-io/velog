import { sangte, useSangteActions, useSangteValue } from 'sangte'
import { CurrentUser } from '@/types/user'

type AuthState = {
  currentUser: CurrentUser | null
  isLoading: boolean
}

const initialState: AuthState = {
  currentUser: null,
  isLoading: false,
}

const authState = sangte(initialState, (prev) => ({
  update(user: CurrentUser | null) {
    prev.currentUser = user
  },
  setLoading(value: boolean) {
    prev.isLoading = value
  },
}))

export function useAuth() {
  const value = useSangteValue(authState)
  const actions = useSangteActions(authState)

  return { value, actions }
}
