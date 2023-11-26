export const getScrollTop = () => {
  if (!document.body) return 0
  const scrollTop = document.documentElement
    ? document.documentElement.scrollTop || document.body.scrollTop
    : document.body.scrollTop
  return scrollTop
}

export const escapeForUrl = (text: string): string => {
  return text
    .replace(
      /[^0-9a-zA-Zㄱ-힣.\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf -]/g,
      '',
    )
    .trim()
    .replace(/ /g, '-')
    .replace(/--+/g, '-')
}

export const getUsernameFromParams = (params: { username?: string }) => {
  if (!params.username) return ''
  const encodedSymbol = encodeURIComponent('@')
  const username = params.username.replace(encodedSymbol, '')
  return username
}

export function loadScript(url: string) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.onload = function onload() {
      resolve(null)
    }
    script.onerror = function onerror() {
      reject()
    }
    script.src = url
    if (!document || !document.head) return
    document.head.appendChild(script)
  })
}

export const getTagByKey = <T extends Record<string, string | string[]>>(
  searchParams: T,
  key: keyof T,
  defaultValue = '',
): string => {
  return Array.isArray(searchParams[key])
    ? searchParams[key][0]
    : (searchParams[key] as string) || defaultValue
}
