'use client'

import { useThemeEffect } from '@/hooks/useThemeEffect'

type Props = {
  children: React.ReactNode
}

const themeScript = `
  (function() {
    // set data-theme attirubute in body tag
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const systemPrefer = localStorage.getItem('system_prefer')

    const isSystemPrefer = !!systemPrefer

    const storageTheme = window.localStorage.getItem('theme') || ''
    const isTheme = storageTheme.includes('light') || storageTheme.includes('dark') // leagcy velog save theme data using JSON.stringify 
    const currentTheme = storageTheme.includes('light') ? 'light' : 'dark'
    const theme = isSystemPrefer ? systemPrefersDark ? 'dark' : 'light' : currentTheme

    if (!isTheme) {
      window.localStorage.removeItem('theme')
    }

    try {
      // set main page ('/', 'trending', '/recent') theme color
      if (theme === 'light') {    
        const isHome = ['/recent','/trending'].includes(window.location.pathname) || window.location.pathname === '/'
        const color = isHome ? '#f8f9fa' : '#ffffff'
        const themeMetaTag = document.querySelector('meta[name="theme-color"]')
        themeMetaTag.setAttribute('media', \`(prefers-color-scheme: \${theme})\`)
        themeMetaTag.setAttribute('content', color)
      }
      
      // set data-theme in body
      document.body.setAttribute('data-theme', isTheme ? theme : 'light')
    } catch (error) {
      console.log('setTheme error', error);
    }
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
