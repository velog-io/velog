'use client'

import styles from './NotificationItem.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {}

function NotificationItem({}: Props) {
  return <div className={cx('block')}></div>
}

export default NotificationItem
