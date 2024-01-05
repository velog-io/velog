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

export const changeThemeColor = (color: string) => {
  const tag = document.querySelector('meta[name="theme-color"]')
  if (!tag) return
  tag.setAttribute('content', color)
}

export const changeAppleMobileStatus = (theme: Theme) => {
  const tag = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')
  if (!tag) return
  const color = theme === 'light' ? 'default' : 'black-translucent'
  tag.setAttribute('content', color)
}
