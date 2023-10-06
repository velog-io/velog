'use client'

import { isClientSide } from '@/lib/isClientSide'
import { useTheme } from '@/state/theme'
import { useEffect } from 'react'

export function useThemeEffect() {
  const { actions } = useTheme()

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
    if (!currentTheme) return
    document.body.dataset.theme = currentTheme
  }, [currentTheme])
}
