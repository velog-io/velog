'use client'

import { useThemeEffect } from '@/hooks/useThemeEffect'

type Props = {}

const themeScript = `
  (function() {
    // set data-theme attirubute in body tag
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const systemPrefer = localStorage.getItem('system-prefer')

    const isSystemPrefer = !!systemPrefer

    const getThemeFromStorage = window.localStorage.getItem('theme') || ''
    const isTheme = getThemeFromStorage.includes('light') || getThemeFromStorage.includes('dark') // leagcy velog save theme data using JSON.stringify 
    const storageTheme = getThemeFromStorage.includes('light') ? 'light' : 'dark'
    const theme = isSystemPrefer ? systemPrefersDark ? 'dark' : 'light' : storageTheme

    if (!isTheme) {
      window.localStorage.removeItem('theme')
    }

    if (!['light', 'dark'].includes(theme)) return

    const isHome = ['/recent','/trending', '/feed'].includes(window.location.pathname) || window.location.pathname === '/'
    const homeColor = isHome ? '#f8f9fa' : '#ffffff'
    const color = theme === 'light' ? homeColor : '#1e1e1e'

    try {
      // set data-theme in body
      document.body.setAttribute('data-theme', isTheme ? theme : 'light')
      
      // set Theme color for mobile header
      const themeColorMetaTag = document.createElement('meta')
      themeColorMetaTag.setAttribute('name', 'theme-color')
      themeColorMetaTag.setAttribute('content', color)
      document.head.appendChild(themeColorMetaTag)

      // set Safari theme color
      const appleMobileStatusMetaTag = document.createElement('meta')
      appleMobileStatusMetaTag.setAttribute('name', 'apple-mobile-web-app-status-bar-style')
      const appleMobileStatusColor = theme === 'light' ? 'default' : 'black'
      appleMobileStatusMetaTag.setAttribute('content', appleMobileStatusColor)
      document.head.appendChild(themeColorMetaTag)
    } catch (error) {
      console.log('setTheme error', error);
    }
  })()
`

function ThemeProvider({}: Props) {
  useThemeEffect()
  return (
    <>
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
