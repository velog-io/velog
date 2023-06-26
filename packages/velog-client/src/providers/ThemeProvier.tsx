'use client'

import { useThemeEffect } from '@/hooks/useThemeEffect'
import { useTheme } from '@/state/theme'
import { useEffect } from 'react'

type Props = {
  children: React.ReactNode
}

function ThemeProvier({ children }: Props) {
  useThemeEffect()

  return <>{children}</>
}

export default ThemeProvier
