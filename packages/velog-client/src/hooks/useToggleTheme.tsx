import { type Theme, useTheme } from '@/state/theme'

export function useToggleTheme() {
  const { actions, theme } = useTheme()

  const saveToStorage = (value: Theme) => {
    localStorage.setItem('THEME', value)
  }

  const toggle = () => {
    if (!theme) return
    if (theme === 'dark') {
      actions.enableLightMode()
      saveToStorage('light')
    } else {
      actions.enableDarkMode()
      saveToStorage('dark')
    }
  }

  return [theme, toggle] as const
}
