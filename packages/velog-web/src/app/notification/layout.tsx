import SmallLayout from '@/components/Layouts/SmallLayout'
import { getAccessToken } from '@/lib/auth'
import getNotificationCount from '@/prefetch/getNotificationCount'

type Props = {
  children: React.ReactNode
}

export default async function NotificationLayout({ children }: Props) {
  const token = getAccessToken()
  const notificationCount = await getNotificationCount(token)
  return <SmallLayout notificationCount={notificationCount}>{children}</SmallLayout>
}
