import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import { cookies } from 'next/headers'

export const getAccessToken = (): RequestCookie | undefined => {
  const cookieStore = cookies()
  return cookieStore.get('access_token') || cookieStore.get('refresh_token')
}

export const isLogged = () => {
  return !!getAccessToken()
}
