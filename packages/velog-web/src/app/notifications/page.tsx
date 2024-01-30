'use client'

import NotificationList from '@/features/notification/components/NotificationList'
import NotificationSkeletonList from '@/features/notification/components/NotificationList/NotificationSkeletonList'
import NotificationSelector from '@/features/notification/components/NotificationSelector'
import NotificationTitle from '@/features/notification/components/NotificationTitle'
import { useCurrentUserQuery } from '@/graphql/helpers/generated'
import { Suspense } from 'react'

export default function NotificationPage() {
  const { data: currentUser } = useCurrentUserQuery()

  return (
    <>
      <NotificationTitle />
      {currentUser && (
        <>
          <Suspense>
            <NotificationSelector />
          </Suspense>
          <Suspense fallback={<NotificationSkeletonList />}>
            <NotificationList />
          </Suspense>
        </>
      )}
    </>
  )
}
