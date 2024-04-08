'use client'

import { useCurrentUserQuery, useNotificationQuery } from '@/graphql/server/generated/server'
import styles from './NotificationList.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import useNotificationMerge from '../../hooks/useNotificationMerge'
import { usePathname } from 'next/navigation'
import NotificationEmpty from '../NotificationEmpty'
import useNotificationToJSX from '../../hooks/useNotificationToJSX'
import { useEffect, useRef, useState } from 'react'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import NotificationSkeletonList from './NotificationSkeletonList'
import { CurrentUser } from '@/types/user'

const cx = bindClassNames(styles)

function NotificationList() {
  const pathname = usePathname()
  const input: Record<string, any> = {}
  if (pathname.includes('/not-read')) {
    Object.assign(input, { is_read: false })
  }

  const [user, setUser] = useState<CurrentUser>()
  const { data: currentUserData, isLoading: currentUserIsLoading } = useCurrentUserQuery()

  useEffect(() => {
    if (!currentUserData?.currentUser) return
    setUser(currentUserData.currentUser)
  }, [currentUserData])

  const { data: notificationData, isLoading: notificationIsLoading } = useNotificationQuery(
    { input },
    { enabled: !!user },
  )

  const ref = useRef<HTMLDivElement>(null)
  const { merged } = useNotificationMerge(notificationData?.notifications)
  const { jsx } = useNotificationToJSX(merged)

  const take = 10
  const [page, setPage] = useState(1)
  const [list, setList] = useState<JSX.Element[]>([])

  const fetchMore = () => {
    if (jsx.length <= list.length) return
    setPage((prev) => prev + 1)
  }

  useEffect(() => {
    setList(jsx.slice(0, page * take))
  }, [jsx, page])

  useInfiniteScroll(ref, fetchMore)

  if (currentUserIsLoading || notificationIsLoading) return <NotificationSkeletonList />
  if (list.length === 0) return <NotificationEmpty />
  return (
    <>
      <ul className={cx('block')}>{list}</ul>
      <div className={cx('bottom')} ref={ref} />
    </>
  )
}

export default NotificationList
