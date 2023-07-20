import { ENV } from '@/env'

export default function gtag(...params: any[]) {
  if (typeof window === 'undefined') return
  if (ENV.appEnv !== 'production') return
  const { gtag: googleTag } = window as any
  if (!googleTag) return
  googleTag(...params)
}
