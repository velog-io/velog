'use client'

import { useThemeEffect } from '@/hooks/useThemeEffect'

type Props = {
  children: React.ReactNode
}

const themeScript = `
  (function() {
    // set data-theme attirubute in body tag
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const currentTheme = window.localStorage.getItem('theme')
    const isTheme = currentTheme === 'light' || currentTheme === 'dark'
    const theme = isTheme ? currentTheme : systemPrefersDark ? 'dark' : 'light'
    if (!isTheme) {
      window.localStorage.removeItem('theme')
    }

    document.body.setAttribute('data-theme', isTheme ? theme : 'light')

    // set meta tag
    const colorMap = {
      light: '#ffffff',
      dark: '#1e1e1e',
    }
    const color = colorMap[theme]

    if (!color) return
    let metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta')
      metaThemeColor.setAttribute('name', 'theme-color')
      document.head.appendChild(metaThemeColor)
    }
    metaThemeColor.setAttribute('content', color)
  })()
`

function ThemeProvier({ children }: Props) {
  // setDefault theme
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
