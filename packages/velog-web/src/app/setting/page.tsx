import getCurrentUser from '@/prefetch/getCurrentUser'
import { cookies } from 'next/headers'

export default async function SettingPage() {
  const cookieStore = cookies()
  const accessToken = cookieStore.get('access_token')

  const user = await getCurrentUser(accessToken)

  if (!user) {
    return <div>emptyPage</div>
  }

  return <div>page</div>
}
