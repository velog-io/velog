import HomeLayout from '@/components/Layouts/HomeLayout'
import { getAccessToken } from '@/lib/auth'
import getNotificationCount from '@/prefetch/getNotificationCount'

type Props = {}

export default async function SearchPage({}: Props) {
  const token = getAccessToken()
  const notificationCount = await getNotificationCount(token)
  return <HomeLayout notificationCount={notificationCount} />
}
