import NotificationList from '@/features/notification/components/NotificationList'
import NotificationSkeletonList from '@/features/notification/components/NotificationList/NotificationSkeletonList'
import NotificationTitle from '@/features/notification/components/NotificationTitle'
import getCurrentUser from '@/prefetch/getCurrentUser'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

export default async function NotificationPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/')
  }
  return (
    <>
      <NotificationTitle />
      <Suspense fallback={<NotificationSkeletonList />}>
        <NotificationList />
      </Suspense>
    </>
  )
}
