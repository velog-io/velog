import { sangte, useSangteActions, useSangteValue } from 'sangte'
import { CurrentUser } from '@/types/user'
import { useEffect, useState } from 'react'
import { setCrispUser } from '@/lib/crisp'

type AuthState = {
  user: CurrentUser | null
}

const initialState: AuthState = {
  user: null,
}

const authState = sangte(initialState, (prev) => ({
  update(user: CurrentUser | undefined) {
    if (user) {
      localStorage.setItem('CURRENT_USER', JSON.stringify(user))
      prev.user = user
    }
  },
  logout() {
    localStorage.removeItem('CURRENT_USER')
    prev.user = null
  },
}))

export function useAuth() {
  const [loading, setLoading] = useState(true)

  const value = useSangteValue(authState)
  const actions = useSangteActions(authState)

  useEffect(() => {
    try {
      setLoading(true)
      const user = localStorage.getItem('CURRENT_USER')
      if (user) {
        const parsed: CurrentUser = JSON.parse(user)
        actions.update(parsed)
        setCrispUser({
          email: parsed.email,
          nickname: parsed.username,
          avatar: parsed.profile.thumbnail,
        })
      }
    } finally {
      setLoading(false)
    }
  }, [actions])

  return { value: { ...value, loading }, actions }
}
