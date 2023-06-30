import { RestoreTokenDocument, UserToken } from '@/graphql/generated'
import postData from '@/lib/postData'
import { NextResponse, type NextRequest } from 'next/server'

export default async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get('access_token')?.value
  const originRefreshToken = req.cookies.get('refresh_token')?.value

  if (!accessToken && originRefreshToken) {
    try {
      const endpoint = `${process.env.NEXT_PUBLIC_GRAPHQL_HOST}/graphql`
      const query = RestoreTokenDocument.loc?.source.body || ''
      const { data } = await postData({
        url: endpoint,
        body: { query },
        headers: { cookie: `refresh_token=${originRefreshToken}` },
        init: { cache: 'no-cache' },
      })

      const { restoreToken } = data
      const { refreshToken, accessToken } = restoreToken as UserToken

      const response = NextResponse.next()
      const domains = ['.velog.io', undefined]

      domains.forEach((domain) => {
        response.cookies.set({
          name: 'access_token',
          value: accessToken,
          httpOnly: true,
          domain,
          maxAge: 1000000,
        })

        response.cookies.set({
          name: 'refresh_token',
          value: refreshToken,
          httpOnly: true,
          domain,
          maxAge: 1000000,
        })
      })

      return response
    } catch (e) {
      throw new Error(String(e))
    }
  }
}

export const config = {
  matcher: '/((?!api|static|.*\\..*|_next).*)',
}
