'use client'

import { useSuspenseNotificationQuery } from '@/graphql/helpers/generated'
import styles from './NotificationList.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import useNotificationMerge from '../../hooks/useNotificationMerge'
import { usePathname } from 'next/navigation'
import NotificationEmpty from '../NotificationEmpty'
import useNotificationReorder from '../../hooks/useNotificationReorder'
import { useRef, useState } from 'react'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'

const cx = bindClassNames(styles)

function NotificationList() {
  const pathname = usePathname()
  const input: Record<string, any> = {}
  if (pathname.includes('/not-read')) {
    Object.assign(input, { is_read: false })
  }

  const ref = useRef<HTMLDivElement>(null)
  const { data } = useSuspenseNotificationQuery({ input })
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

  if (data.notifications.length === 0) return <NotificationEmpty />
  return (
    <>
      <ul className={cx('block')}>{list}</ul>
      <div className={cx('bottom')} ref={ref} />
    </>
  )
}

export default NotificationList
