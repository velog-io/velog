export const detectIOS = () => {
  if (typeof window !== 'object') return false
  const checkAgent = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream

  const checkPlatform =
    (/iPad|iPhone|iPod/.test(navigator.platform) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) &&
    !(window as any).MSStream

  return checkAgent || checkPlatform
}
