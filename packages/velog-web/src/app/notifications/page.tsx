import NotificationList from '@/features/notification/components/NotificationList'
import NotificationSelector from '@/features/notification/components/NotificationSelector'
import NotificationTitle from '@/features/notification/components/NotificationTitle'
import getCurrentUser from '@/prefetch/getCurrentUser'
import { notFound } from 'next/navigation'

export default async function NotificationPage() {
  const user = await getCurrentUser()

  if (!user) {
    notFound()
  }

  return (
    <>
      <NotificationTitle />
      <NotificationSelector />
      <NotificationList />
    </>
  )
}
