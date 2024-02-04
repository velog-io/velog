import NotificationList from '@/features/notification/components/NotificationList'
import NotificationSelector from '@/features/notification/components/NotificationSelector'
import NotificationTitle from '@/features/notification/components/NotificationTitle'
import getCurrentUser from '@/prefetch/getCurrentUser'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

export default async function NotificationPage() {
  await fetch(`${process.env.NEXT_PUBLIC_CLIENT_HOST}/notifications/api`, {
    method: 'GET',
    credentials: 'include',
  })

  const user = await getCurrentUser()

  if (!user) {
    notFound()
  }

  return (
    <>
      <NotificationTitle />
      <Suspense>
        <NotificationSelector />
        <NotificationList />
      </Suspense>
    </>
  )
}
