/* eslint-disable @typescript-eslint/no-unused-vars */
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const accessToken = req.cookies.get('access_token')?.value

  // console.log(`cookies in handler: ${allCookies.length > 0 ? allCookies.length : 'empty'}`)
  return new NextResponse('Done', { status: 200 })
}
