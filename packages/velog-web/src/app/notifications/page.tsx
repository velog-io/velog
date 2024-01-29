import NotificationList from '@/features/notification/components/NotificationList'
import NotificationSkeletonList from '@/features/notification/components/NotificationList/NotificationSkeletonList'
import NotificationSelector from '@/features/notification/components/NotificationSelector'
import NotificationTitle from '@/features/notification/components/NotificationTitle'
import { Suspense } from 'react'

export default async function NotificationPage(any: any) {
  console.log('any!!', any)

  return (
    <>
      <NotificationTitle />
      <Suspense>
        <NotificationSelector />
      </Suspense>
      <Suspense fallback={<NotificationSkeletonList />}>
        <NotificationList />
      </Suspense>
    </>
  )
}
