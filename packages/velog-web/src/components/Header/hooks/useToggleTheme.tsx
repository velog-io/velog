import { useTheme } from '@/state/theme'
import { useCallback } from 'react'

export function useToggleTheme() {
  const { actions, theme } = useTheme()

  const toggle = useCallback(() => {
    if (!theme) return
    if (theme === 'dark') {
      actions.enableLightMode()
      localStorage.setItem('theme', 'light')
    }
    if (theme === 'light') {
      actions.enableDarkMode()
      localStorage.setItem('theme', 'dark')
    }
  }, [theme, actions])

  return { theme, toggle }
}
