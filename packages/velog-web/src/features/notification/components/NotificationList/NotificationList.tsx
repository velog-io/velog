'use client'

import { useSuspenseNotificationQuery } from '@/graphql/helpers/generated'
import styles from './NotificationList.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { Suspense } from 'react'

const cx = bindClassNames(styles)

type Props = {}

function NotificationList({}: Props) {
  const { data, isLoading } = useSuspenseNotificationQuery()
  console.log('data', data)
  return (
    <Suspense fallback={<>loading...</>}>
      <div className={cx('block')}></div>
    </Suspense>
  )
}

export default NotificationList
