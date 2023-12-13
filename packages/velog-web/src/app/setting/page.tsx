import getCurrentUser from '@/prefetch/getCurrentUser'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'

export default async function SettingPage() {
  const cookieStore = cookies()
  const token = cookieStore.get('access_token') || cookieStore.get('refresh_token')

  const user = await getCurrentUser(token)

  if (!user) {
    notFound()
  }

  return <div>page</div>
}
