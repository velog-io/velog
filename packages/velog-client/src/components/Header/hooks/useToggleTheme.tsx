import { type Theme, useTheme } from '@/state/theme'
import { useCallback } from 'react'

export function useToggleTheme() {
  const { actions, theme } = useTheme()

  const saveToStorage = (value: Theme) => {
    localStorage.setItem('THEME', value)
  }

  const toggle = useCallback(() => {
    if (!theme) return
    if (theme === 'dark') {
      actions.enableLightMode()
      saveToStorage('light')
    } else {
      actions.enableDarkMode()
      saveToStorage('dark')
    }
  }, [theme, actions])

  return { theme, toggle }
}
