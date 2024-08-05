'use client'

import { UndrawEmptyNotification } from '@/assets/vectors/components'
import styles from './NotificationEmpty.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {}

function NotificationEmpty({}: Props) {
  return (
    <>
      <div className={cx('block', 'center')}>
        <UndrawEmptyNotification className={cx('svg')} />
      </div>
      <div className={cx('title')}>새로운 알림이 없습니다.</div>
    </>
  )
}

export default NotificationEmpty
