import { Theme } from '@/state/theme'

export const saveThemeToStorage = (theme: Theme) => {
  localStorage.setItem('theme', theme)
  document.cookie = `theme=${theme}; path=/;` // FOR Legacy velog
}

export const setThemeColor = (theme: Theme) => {
  const colorMap = {
    light: '#ffffff',
    dark: '#1e1e1e',
  }

  const color = colorMap[theme]
  let metaThemeColor = document.querySelector('meta[name="theme-color"]')
  if (!metaThemeColor) {
    metaThemeColor = document.createElement('meta')
    metaThemeColor.setAttribute('name', 'theme-color')
    document.head.appendChild(metaThemeColor)
  }
  metaThemeColor.setAttribute('media', `(prefers-color-scheme: ${theme})`)
  metaThemeColor.setAttribute('content', color)
}

export const setScrollBarSchemeColor = (theme: Theme) => {
  let scrollBarSchemeMetaTag = document.querySelector('meta[name="color-scheme"]')
  if (!scrollBarSchemeMetaTag) {
    scrollBarSchemeMetaTag = document.createElement('meta')
    scrollBarSchemeMetaTag.setAttribute('name', 'color-scheme')
    document.head.appendChild(scrollBarSchemeMetaTag)
  }
  scrollBarSchemeMetaTag.setAttribute('content', theme)
}
