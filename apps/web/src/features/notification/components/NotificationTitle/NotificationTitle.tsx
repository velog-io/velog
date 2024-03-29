'use client'

import {
  useNotNoticeNotificationCountQuery,
  useUpdateNotNoticeNotificationMutation,
} from '@/graphql/helpers/generated'
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

  return <div className={cx('block')}>알림</div>
}

export default NotificationTitle
