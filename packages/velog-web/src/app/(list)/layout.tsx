import HomeLayout from '@/components/Layouts/HomeLayout'
import { getAccessToken } from '@/lib/auth'
import getNotificationCount from '@/prefetch/getNotificationCount'

type Props = {
  children: React.ReactNode
}

export default async function HomeListLayout({ children }: Props) {
  const token = getAccessToken()
  const notificationCount = await getNotificationCount(token)
  console.log('notificationCount', notificationCount)
  return <HomeLayout notificationCount={notificationCount}>{children}</HomeLayout>
}
