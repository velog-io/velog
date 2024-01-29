import getCurrentUser from '@/prefetch/getCurrentUser'

export async function GET(request: Request) {
  console.log('request:', request)
  const user = await getCurrentUser()

  return Response.json({ user })
}
