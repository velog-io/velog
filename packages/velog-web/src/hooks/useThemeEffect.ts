'use client'

import { saveThemeToStorage, setMetaThemeColor } from '@/lib/themeHelpers'
import { useTheme } from '@/state/theme'
import { useEffect } from 'react'

export function useThemeEffect() {
  const { actions, theme: currentTheme } = useTheme()

  useEffect(() => {
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    actions.setSystemTheme(systemPrefersDark ? 'dark' : 'light')
  }, [actions])

  useEffect(() => {
    const theme = localStorage.getItem('theme')
    if (theme === 'dark') {
      actions.enableDarkMode()
    }
    if (theme === 'light') {
      actions.enableLightMode()
    }
  }, [actions])

  useEffect(() => {
    if (!currentTheme) return
    document.body.dataset.theme = currentTheme
    saveThemeToStorage(currentTheme)
    setMetaThemeColor(currentTheme)
  }, [actions, currentTheme])
}
