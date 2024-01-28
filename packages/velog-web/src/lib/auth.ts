import { type RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies'

export const getAccessToken = async (): Promise<RequestCookie | undefined> => {
  if (typeof window !== 'undefined') {
    return undefined
  }

  const { cookies } = (await import('next/headers')).default
  const cookieStore = cookies()
  return cookieStore.get('access_token') || cookieStore.get('refresh_token')
}

export const isLogged = () => {
  return !!getAccessToken()
}
