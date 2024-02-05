import { NextResponse } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware() {
  const response = NextResponse.next()

  response.headers.append('Access-Control-Allow-Credentials', 'true')
  response.headers.append('Access-Control-Allow-Origin', '*')
  response.headers.append('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT')

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
