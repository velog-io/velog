import RequireLogin from '@/components/RequireLogin'
import NotificationList from '@/features/notification/components/NotificationList'
import NotificationSelector from '@/features/notification/components/NotificationSelector'
import NotificationTitle from '@/features/notification/components/NotificationTitle'
import getCurrentUser from '@/prefetch/getCurrentUser'

export default async function NotificationPage() {
  const user = await getCurrentUser()

  if (!user) {
    return <RequireLogin />
  }

  return (
    <>
      <NotificationTitle />
      <NotificationSelector />
      <NotificationList />
    </>
  )
}
