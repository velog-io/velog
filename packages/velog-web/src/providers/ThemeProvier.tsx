'use client'

import { useThemeEffect } from '@/hooks/useThemeEffect'

type Props = {
  children: React.ReactNode
}

const themeScript = `
  (function() {
    const theme = window.localStorage.getItem('THEME')
    const isString = typeof theme === 'string'
    document.body.setAttribute('data-theme', isString ? theme : 'light')
  })()
`

function ThemeProvier({ children }: Props) {
  useThemeEffect()
  return (
    <>
      {children}
      <script
        id="theme-provider"
        dangerouslySetInnerHTML={{
          __html: themeScript,
        }}
      ></script>
    </>
  )
}

export default ThemeProvier
