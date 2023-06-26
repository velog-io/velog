'use client'

import { useThemeEffect } from '@/hooks/useThemeEffect'
import { Theme, useTheme } from '@/state/theme'
import { useEffect } from 'react'

type Props = {
  children: React.ReactNode
}

function ThemeProvier({ children }: Props) {
  useThemeEffect()
  const theme = localStorage.getItem('THEME')
  const { actions } = useTheme()
  useEffect(() => {
    if (theme === 'dark') {
      actions.enableDarkMode()
    }
    if (theme === 'light') {
      actions.enableLightMode()
    }
  }, [theme, actions])

  return <>{children}</>
}

export default ThemeProvier
