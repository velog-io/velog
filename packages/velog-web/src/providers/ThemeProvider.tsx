'use client'

import { useThemeEffect } from '@/hooks/useThemeEffect'

type Props = {
  children: React.ReactNode
}

const themeScript = `
  (function() {
    // set data-theme attirubute in body tag
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const storageTheme = window.localStorage.getItem('theme') || ''
    const isTheme = storageTheme.includes('light') || storageTheme.includes('dark') // leagcy velog save theme data using JSON.stringify 
    const currentTheme = storageTheme.includes('light') ? 'light' : 'dark'
    const theme = isTheme ? currentTheme : systemPrefersDark ? 'dark' : 'light'

    if (!isTheme) {
      window.localStorage.removeItem('theme')
    }

    document.body.setAttribute('data-theme', isTheme ? theme : 'light')
    
    const isHome = ['/recent','/trending'].includes(window.location.pathname) || window.location.pathname === '/'
    
    // set data-theme
    const colorMap = {
      light: isHome ? '#f8f9fa' : '#ffffff',
      dark: '#1e1e1e',
    }
    const color = colorMap[theme]

    if (!color) return
    let themeMetaTag = document.querySelector('meta[name="theme-color"]')
    if (!themeMetaTag) {
      themeMetaTag = document.createElement('meta')
      themeMetaTag.setAttribute('name', 'theme-color')
      document.head.appendChild(themeMetaTag)
    }
    themeMetaTag.setAttribute('media', \`(prefers-color-scheme: \${theme})\`)
    themeMetaTag.setAttribute('content', color)

    // set scrollbar-scheme
    let scrollSchemeMetaTag = document.querySelector('meta[name="color-scheme"]')
    if (!scrollSchemeMetaTag) {
      scrollSchemeMetaTag = document.createElement('meta')
      scrollSchemeMetaTag.setAttribute('name', 'color-scheme')
      document.head.appendChild(scrollSchemeMetaTag)
    }
    scrollSchemeMetaTag.setAttribute('content', theme)
  })()
`

function ThemeProvider({ children }: Props) {
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

export default ThemeProvider
