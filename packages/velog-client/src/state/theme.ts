import { sangte, useSangteActions, useSangteValue } from 'sangte'

export type Theme = 'dark' | 'light'

type ThemeState = {
  theme: Theme | null
  systemTheme: 'dark' | 'light' | 'not-ready'
}
const initialState: ThemeState = {
  theme: null,
  systemTheme: 'not-ready',
}

const themeState = sangte(initialState, (prev) => ({
  enableLightMode() {
    localStorage.setItem('THEME', 'light')
    prev.theme = 'light'
  },
  enableDarkMode() {
    localStorage.setItem('THEME', 'dark')
    prev.theme = 'dark'
  },
  setSystemTheme(theme: Theme) {
    prev.systemTheme = theme
  },
}))

export function useTheme() {
  const value = useSangteValue(themeState)
  const actions = useSangteActions(themeState)

  const theme = (() => {
    if (value.systemTheme === 'not-ready') return 'light'
    if (value.theme) return value.theme
    return value.systemTheme
  })()

  return { value, actions, theme }
}
