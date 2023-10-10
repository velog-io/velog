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
    localStorage.setItem('theme', 'light')
    prev.theme = 'light'
    setMetaThemeColor('#ffffff')
  },
  enableDarkMode() {
    localStorage.setItem('theme', 'dark')
    prev.theme = 'dark'
    setMetaThemeColor('#1e1e1e')
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

function setMetaThemeColor(color: string) {
  let metaThemeColor = document.querySelector('meta[name="theme-color"]')
  if (!metaThemeColor) {
    metaThemeColor = document.createElement('meta')
    metaThemeColor.setAttribute('name', 'theme-color')
    document.head.appendChild(metaThemeColor)
  }
  metaThemeColor.setAttribute('content', color)
}
