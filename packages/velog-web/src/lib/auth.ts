import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import { cookies } from 'next/headers'

export const getAccessToken = (): Promise<RequestCookie | undefined> => {
  const cookieStore = cookies()
  const cookie = cookieStore.get('access_token') || cookieStore.get('refresh_token')
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(cookie)
    }, 0)
  })
}

export const isLogged = () => {
  return !!getAccessToken()
}
