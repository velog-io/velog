'use client'

import { bindClassNames } from '@/lib/styles/bindClassNames'
import styles from './NotificationList.module.css'
import NotificationSkeletonItem from '../NotificationItem/NotificationSkeletonItem'

const cx = bindClassNames(styles)

type Props = {}

function NotificationSkeletonList({}: Props) {
  return (
    <ul className={cx('block', 'skeleton')}>
      {Array(5)
        .fill(0)
        .map((_, index) => (
          <NotificationSkeletonItem key={index} index={index} />
        ))}
    </ul>
  )
}

export default NotificationSkeletonList
