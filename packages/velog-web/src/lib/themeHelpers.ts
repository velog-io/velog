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

export const setMobileHeaderColor = (color: string) => {
  const meta = document.querySelector('meta[name="theme-color"]')
  if (!meta) return
  meta.setAttribute('content', color)
}
