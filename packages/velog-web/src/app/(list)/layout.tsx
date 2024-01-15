import HomeLayout from '@/components/Layouts/HomeLayout'
import getNotificationCount from '@/prefetch/getNotificationCount'

type Props = {
  children: React.ReactNode
}

export default async function HomeListLayout({ children }: Props) {
  const notificationCount = await getNotificationCount()
  console.log('notificationCount', notificationCount)
  return <HomeLayout notificationCount={notificationCount}>{children}</HomeLayout>
}
