import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = cookies()
  const token = cookieStore.get('access_token')

  const headers = {}
  if (token) {
    Object.assign(headers, { 'Set-Cookie': `token=${token.value}` })
  }

  return new Response('Ok', {
    status: 200,
    headers,
  })
}
