import { useTheme } from '@/state/theme'
import { useCallback } from 'react'

export function useToggleTheme() {
  const { actions, theme } = useTheme()

  const toggle = useCallback(() => {
    if (!theme) return
    if (theme === 'dark') {
      actions.enableLightMode()
    } else {
      actions.enableDarkMode()
    }
  }, [theme, actions])

  return { theme, toggle }
}
