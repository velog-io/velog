import HomeLayout from '@/components/Layouts/HomeLayout'
import getNotificationCount from '@/prefetch/getNotificationCount'

type Props = {
  children: React.ReactNode
}

export default async function HomeListLayout({ children }: Props) {
  const notificationCount = await getNotificationCount()
  return <HomeLayout notificationCount={notificationCount}>{children}</HomeLayout>
}
