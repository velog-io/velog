import SmallLayout from '@/components/Layouts/SmallLayout'
import getNotificationCount from '@/prefetch/getNotificationCount'

type Props = {
  children: React.ReactNode
}

export default async function NotificationLayout({ children }: Props) {
  const notificationCount = await getNotificationCount()
  return <SmallLayout notificationCount={notificationCount}>{children}</SmallLayout>
}
