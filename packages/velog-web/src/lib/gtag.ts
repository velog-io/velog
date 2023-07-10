export default function gtag(...params: any[]) {
  if (typeof window === 'undefined') return
  if (process.env.NODE_ENV !== 'production') return
  const { gtag: googleTag } = window as any
  if (!googleTag) return
  googleTag(...params)
}
