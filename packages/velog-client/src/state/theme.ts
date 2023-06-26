import { sangte } from 'sangte'

type ThemeState = {
  theme: 'dark' | 'light' | null
}
const initialState: ThemeState = {
  theme: null,
}

const themeState = sangte(initialState, (prev) => ({
  enableLightMode() {
    localStorage.set('THEME', 'light')
  },
  enableDarkMode() {
    localStorage.set('THEME', 'dark')
  },
}))

export function useTheme() {}
