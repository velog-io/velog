import { useAuth } from '@/state/auth'
import { useCallback } from 'react'

export default function useHeader() {
  const {
    value: { user },
    actions,
  } = useAuth()

  const onLoginClick = useCallback(() => {}, [])

  const onLogout = useCallback(() => {}, [])

  return { user, onLoginClick, onLogout }
}
