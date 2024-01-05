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

export const setLightThemeColor = (theme: Theme, color: string) => {
  if (theme === 'dark') return
  const metaThemeColor = document.querySelectorAll('meta[name="theme-color"]')
  if (!metaThemeColor) return // default set with viewport in layout
  metaThemeColor.forEach((meta) => {
    const media = meta.getAttribute('media')
    if (media?.includes('light')) {
      meta.setAttribute('media', `(prefers-color-scheme: ${theme})`)
      meta.setAttribute('content', color)
    }
  })
}

export const setMobileHeaderColor = (color: string) => {
  const metaThemeColor = document.querySelectorAll('meta[name="theme-color"]')
  metaThemeColor.forEach((meta) => {
    const media = meta.getAttribute('media')
    if (!media) {
      meta.setAttribute('content', color)
    }
  })
}
