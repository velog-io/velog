import { RestoreTokenDocument, UserToken } from '@/graphql/generated'
import { NextResponse, type NextRequest } from 'next/server'

export default async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get('access_token')?.value
  const originRefreshToken = req.cookies.get('refresh_token')?.value

  if (!accessToken && originRefreshToken) {
    try {
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_GRAPHQL_HOST}/graphql`,
        {
          method: 'POST',
          body: JSON.stringify({
            query: RestoreTokenDocument.loc?.source.body,
          }),
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Cookie: `refresh_token=${originRefreshToken}`,
          },
          cache: 'no-cache',
        }
      )

      const {
        data: { restoreToken },
      } = await result.json()

      const { refreshToken, accessToken } = restoreToken as UserToken

      const res = NextResponse.next()
      const domains = ['.velog.io', undefined]
      domains.forEach((domain) => {
        res.cookies.set({
          name: 'access_token',
          value: accessToken,
          httpOnly: true,
          domain,
        })

        res.cookies.set({
          name: 'refresh_token',
          value: refreshToken,
          httpOnly: true,
          domain,
        })
      })
    } catch (e) {
      throw new Error(String(e))
    }
  }
}

export const config = {
  matcher: '/((?!api|static|.*\\..*|_next).*)',
}
