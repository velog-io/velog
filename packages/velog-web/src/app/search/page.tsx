import HomeLayout from '@/components/Layouts/HomeLayout'
import { getAccessToken } from '@/lib/auth'
import getNotificationCount from '@/prefetch/getNotificationCount'

type Props = {}

export default async function SearchPage({}: Props) {
  const notificationCount = await getNotificationCount()
  return <HomeLayout notificationCount={notificationCount} />
}
