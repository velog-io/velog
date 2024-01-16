'use client'

import { Notification, useSuspenseNotificationQuery } from '@/graphql/helpers/generated'
import styles from './NotificationList.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {}

function NotificationList({}: Props) {
  const { data } = useSuspenseNotificationQuery()
  const result = data.notifications.reduce<Record<string, Notification[]>>((acc, cur) => {
    if (!cur.action_id) return acc
    if (acc[cur.action_id]) {
      acc[cur.action_id].push(cur as Notification)
    } else {
      acc[cur.action_id] = [cur as Notification]
    }
    return acc
  }, {})

  console.log('result', result)

  return <ul className={cx('block')}></ul>
}

export default NotificationList
