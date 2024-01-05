'use client'

import { checkIsHome } from '@/lib/checkIsHome'
import { saveThemeToStorage, changeThemeColor, changeAppleMobileStatus } from '@/lib/themeHelpers'
import { useTheme } from '@/state/theme'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect } from 'react'

export function useThemeEffect() {
  const { actions, theme: currentTheme } = useTheme()
  const pathname = usePathname()

  const handleTheme = useCallback(
    (theme = 'light') => {
      if (theme === 'dark') {
        actions.enableDarkMode()
      }
      if (theme === 'light') {
        actions.enableLightMode()
      }
    },
    [actions],
  )

  useEffect(() => {
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    actions.setSystemTheme(systemPrefersDark ? 'dark' : 'light')
    handleTheme(systemPrefersDark ? 'dark' : 'light')
  }, [actions, handleTheme])

  useEffect(() => {
    const systemPrefer = localStorage.getItem('system_prefer')
    if (!!systemPrefer) {
      actions.setSystemThemePrefer(true)
    } else {
      const theme = localStorage.getItem('theme') ?? undefined
      const isTheme = ['light', 'dark'].includes(theme ?? '')
      actions.setSystemThemePrefer(false)
      handleTheme(isTheme ? theme : 'light')
    }
  }, [actions, handleTheme])

  useEffect(() => {
    if (!currentTheme) return
    const isHome = checkIsHome(pathname)
    document.body.dataset.theme = currentTheme

    const color = currentTheme === 'light' ? (isHome ? '#f8f9fa' : '#ffffff') : '#1e1e1e'

    saveThemeToStorage(currentTheme)
    changeThemeColor(color)
    changeAppleMobileStatus(color)
  }, [actions, currentTheme, pathname])
}
