import { RestoreTokenDocument, UserToken } from '@/graphql/generated'
import { NextResponse, type NextRequest } from 'next/server'
import postData from '@/lib/postData'

export default async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get('access_token')?.value
  const originRefreshToken = req.cookies.get('refresh_token')?.value

  const response = NextResponse.next()
  if (!accessToken && originRefreshToken) {
    try {
      const query = RestoreTokenDocument || ''

      if (!query) return

      const { data } = await postData({
        body: { query },
        headers: { cookie: `refresh_token=${originRefreshToken}` },
        init: { cache: 'no-cache' },
      })

      const { restoreToken } = data
      const { refreshToken, accessToken } = restoreToken as UserToken

      const domains = ['.velog.io', undefined]

      domains.forEach((domain) => {
        response.cookies.set({
          name: 'access_token',
          value: accessToken,
          httpOnly: true,
          domain,
          maxAge: 1000 * 60 * 60, // 1hour
        })

        response.cookies.set({
          name: 'refresh_token',
          value: refreshToken,
          httpOnly: true,
          domain,
          maxAge: 1000 * 60 * 60 * 24 * 30, // 30days
        })
      })
    } catch (e) {
      console.log(e)
      response.cookies.delete('access_token')
      response.cookies.delete('refresh_token')
    }
  }
  return response
}

export const config = {
  matcher: '/((?!api|static|.*\\..*|_next).*)',
}
