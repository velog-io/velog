'use client'

import { useCurrentUserQuery, useNotificationQuery } from '@/graphql/helpers/generated'
import styles from './NotificationList.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import useNotificationMerge from '../../hooks/useNotificationMerge'
import { usePathname } from 'next/navigation'
import NotificationEmpty from '../NotificationEmpty'
import useNotificationReorder from '../../hooks/useNotificationReorder'
import { useRef, useState } from 'react'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import NotificationSkeletonList from './NotificationSkeletonList'

const cx = bindClassNames(styles)

function NotificationList() {
  const pathname = usePathname()
  const input: Record<string, any> = {}
  if (pathname.includes('/not-read')) {
    Object.assign(input, { is_read: false })
  }

  const { data: currentUserData } = useCurrentUserQuery()
  const user = currentUserData?.currentUser

  const { data, isLoading } = useNotificationQuery({ input }, { enabled: !user })

  const ref = useRef<HTMLDivElement>(null)
  const { merged } = useNotificationMerge(data?.notifications)
  const { jsx } = useNotificationReorder(merged)

  const [page, setPage] = useState(1)
  const take = 20
  const [list, setList] = useState(jsx.slice(0, page * take))

  const fetchMore = () => {
    if (jsx.length <= list.length) return
    const currentPage = page + 1
    setList(jsx.slice(0, currentPage * take))
    setPage(currentPage)
  }

  useInfiniteScroll(ref, fetchMore)

  if (isLoading) return <NotificationSkeletonList />
  if (data?.notifications.length === 0) return <NotificationEmpty />
  return (
    <>
      <ul className={cx('block')}>{list}</ul>
      <div className={cx('bottom')} ref={ref} />
    </>
  )
}

export default NotificationList
