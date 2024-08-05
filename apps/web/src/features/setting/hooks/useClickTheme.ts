import { removeSystemPrefer, saveSystemPrefer } from '@/lib/themeHelpers'
import { useTheme } from '@/state/theme'
import { useCallback } from 'react'

export function useClickTheme() {
  const {
    actions,
    theme,
    value: { isSystemThemePrefer },
  } = useTheme()

  const click = useCallback(
    (target: 'light' | 'dark' | 'system') => {
      if (target === 'system') {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        if (systemPrefersDark) {
          actions.enableDarkMode()
        } else {
          actions.enableLightMode()
        }
        actions.setSystemThemePrefer(true)
        saveSystemPrefer()
        return
      }

      if (target === 'light') {
        actions.enableLightMode()
      }

      if (target === 'dark') {
        actions.enableDarkMode()
      }
      // Not system theme prefers case
      actions.setSystemThemePrefer(false)
      removeSystemPrefer()
    },
    [actions],
  )

  return { click, theme, isSystemThemePrefer }
}
