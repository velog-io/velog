import { sangte, useSangteActions, useSangteValue } from 'sangte'
import { CurrentUser } from '@/types/user'
import { useEffect, useState } from 'react'

type AuthState = {
  user: CurrentUser | null
}

const initialState: AuthState = {
  user: null,
}

const authState = sangte(initialState, (prev) => ({
  update(user: CurrentUser | null) {
    if (!user) return
    prev.user = user
  },
}))

export function useAuth() {
  const value = useSangteValue(authState)
  const actions = useSangteActions(authState)

  return { value, actions }
}
