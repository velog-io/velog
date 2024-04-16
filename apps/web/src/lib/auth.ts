'use server'

import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import { cookies } from 'next/headers'

export const getAccessToken = async (): Promise<RequestCookie | undefined> => {
  const cookieStore = cookies()

  const cookie = cookieStore.get('access_token') || cookieStore.get('refresh_token')
  return cookie
}

export const isLogged = () => {
  return !!getAccessToken()
}
