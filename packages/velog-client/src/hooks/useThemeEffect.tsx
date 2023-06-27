import { useTheme } from '@/state/theme'
import { useEffect } from 'react'

export function useThemeEffect() {
  const { actions, value } = useTheme()
  const theme = value.theme

  useEffect(() => {
    const systemPrefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches

    actions.setSystemTheme(systemPrefersDark ? 'dark' : 'light')
  }, [actions])

  useEffect(() => {
    const currentTheme = localStorage.getItem('THEME')
    if (currentTheme === 'dark') {
      actions.enableDarkMode()
    }
    if (currentTheme === 'light') {
      actions.enableLightMode()
    }
  }, [actions])

  useEffect(() => {
    if (!theme) return
    document.body.dataset.theme = theme
  }, [theme])
}
