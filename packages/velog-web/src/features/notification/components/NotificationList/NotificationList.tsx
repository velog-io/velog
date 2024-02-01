'use client'

import { useCurrentUserQuery, useNotificationQuery } from '@/graphql/helpers/generated'
import styles from './NotificationList.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import useNotificationMerge from '../../hooks/useNotificationMerge'
import { usePathname } from 'next/navigation'
import NotificationEmpty from '../NotificationEmpty'
import useNotificationReorder from '../../hooks/useNotificationReorder'
import { useEffect, useRef, useState } from 'react'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import NotificationSkeletonList from './NotificationSkeletonList'

const cx = bindClassNames(styles)

function NotificationList() {
  const pathname = usePathname()
  const input: Record<string, any> = {}
  if (pathname.includes('/not-read')) {
    Object.assign(input, { is_read: false })
  }

  const { data: currentUserData, isLoading: currentUserIsLoading } = useCurrentUserQuery()
  const user = currentUserData?.currentUser

  const {
    data: notificationData,
    isLoading: notificationIsLoading,
    isRefetching,
  } = useNotificationQuery({ input }, { enabled: !!user })

  const ref = useRef<HTMLDivElement>(null)
  const { merged } = useNotificationMerge(notificationData?.notifications)
  const { jsx } = useNotificationReorder(merged)

  const [page, setPage] = useState(1)
  const take = 10
  const [list, setList] = useState<JSX.Element[]>([])

  const fetchMore = () => {
    if (jsx.length <= list.length) return
    setPage((prev) => prev + 1)
  }

  useEffect(() => {
    setList(jsx.slice(0, page * take))
  }, [jsx, page])

  useInfiniteScroll(ref, fetchMore)

  if (currentUserIsLoading || notificationIsLoading || isRefetching)
    return <NotificationSkeletonList />
  if (list.length === 0) return <NotificationEmpty />
  return (
    <>
      <ul className={cx('block')}>{list}</ul>
      <div className={cx('bottom')} ref={ref} />
    </>
  )
}

export default NotificationList
