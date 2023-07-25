import { isClientSide } from '@/lib/isClientSide'
import { useTheme } from '@/state/theme'
import { useEffect } from 'react'

export function useThemeEffect() {
  const { actions, value } = useTheme()
  const { theme } = value

  useEffect(() => {
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    actions.setSystemTheme(systemPrefersDark ? 'dark' : 'light')
  }, [actions])

  const currentTheme = isClientSide && localStorage.getItem('THEME')
  useEffect(() => {
    if (currentTheme === 'dark') {
      actions.enableDarkMode()
    }
    if (currentTheme === 'light') {
      actions.enableLightMode()
    }
  }, [actions, currentTheme])

  useEffect(() => {
    if (!theme) return
    document.body.dataset.theme = theme
  }, [theme])
}
