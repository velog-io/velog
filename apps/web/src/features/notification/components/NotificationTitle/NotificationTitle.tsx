'use client'

import {
  useNotNoticeNotificationCountQuery,
  useUpdateNotNoticeNotificationMutation,
} from '@/graphql/server/generated/server'
import styles from './NotificationTitle.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { useEffect } from 'react'

const cx = bindClassNames(styles)

type Props = {}

function NotificationTitle({}: Props) {
  const { mutate } = useUpdateNotNoticeNotificationMutation()
  const { data, refetch } = useNotNoticeNotificationCountQuery()

  useEffect(() => {
    if (!data) return
    if (data.notNoticeNotificationCount === 0) return
    mutate({})
    refetch()
  }, [data, mutate, refetch])

  return (
    <div className={cx('block')}>
      <div className={cx('title')}>알림</div>
    </div>
  )
}

export default NotificationTitle
