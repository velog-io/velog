import { sangte, useSangteActions, useSangteValue } from 'sangte'
import { CurrentUser } from '@/types/user'

type AuthState = {
  currentUser: CurrentUser | null
}

const initialState: AuthState = {
  currentUser: null,
}

const authState = sangte(initialState, (prev) => ({
  update(user: CurrentUser | null) {
    prev.currentUser = user
  },
}))

export function useAuth() {
  const value = useSangteValue(authState)
  const actions = useSangteActions(authState)

  return { value, actions }
}
