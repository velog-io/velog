'use client'

import { useThemeEffect } from '@/hooks/useThemeEffect'

type Props = {
  children: React.ReactNode
}

function ThemeProvier({ children }: Props) {
  useThemeEffect()

  return <>{children}</>
}

export default ThemeProvier
