'use client'

import styles from './NotificationTitle.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {}

function NotificationTitle({}: Props) {
  return <div className={cx('block')}>알림</div>
}

export default NotificationTitle
