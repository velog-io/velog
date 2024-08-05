import { useCallback } from 'react'
import { sangte, useSangteActions, useSangteValue } from 'sangte'

export type Theme = 'dark' | 'light'

type ThemeState = {
  theme: Theme | null
  systemTheme: 'dark' | 'light' | 'not-ready'
  isSystemThemePrefer: boolean
}

const initialState: ThemeState = {
  theme: null,
  systemTheme: 'not-ready',
  isSystemThemePrefer: false,
}

const themeState = sangte(initialState, (prev) => ({
  enableLightMode() {
    prev.theme = 'light'
  },
  enableDarkMode() {
    prev.theme = 'dark'
  },
  setSystemTheme(theme: 'light' | 'dark') {
    prev.systemTheme = theme
  },
  setSystemThemePrefer(value: boolean) {
    prev.isSystemThemePrefer = value
  },
}))

export function useTheme() {
  const value = useSangteValue(themeState)
  const actions = useSangteActions(themeState)

  const getTheme = useCallback(() => {
    if (value.systemTheme === 'not-ready') return null
    if (value.theme) return value.theme
    return value.systemTheme
  }, [value.theme, value.systemTheme])

  return { value, actions, theme: getTheme() }
}
