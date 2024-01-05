import { Theme } from '@/state/theme'

export const saveThemeToStorage = (theme: Theme) => {
  localStorage.setItem('theme', theme)
  document.cookie = `theme=${theme}; path=/;` // For Legacy velog
}

export const saveSystemPrefer = () => {
  localStorage.setItem('system_prefer', 'system')
}

export const removeSystemPrefer = () => {
  localStorage.removeItem('system_prefer')
}

export const setLightThemeColor = (theme: Theme, isHome: boolean) => {
  if (theme === 'dark') return
  const color = isHome ? '#f8f9fa' : '#ffffff'

  const metaThemeColor = document.querySelector('meta[name="theme-color"]')
  if (!metaThemeColor) return // default set with viewport in layout
  metaThemeColor.setAttribute('media', `(prefers-color-scheme: ${theme})`)
  metaThemeColor.setAttribute('content', color)
}
