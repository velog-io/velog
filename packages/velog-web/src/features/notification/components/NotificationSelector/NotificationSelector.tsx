'use client'

import Link from 'next/link'
import styles from './NotificationSelector.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { usePathname } from 'next/navigation'

const cx = bindClassNames(styles)

function NotificationSelector() {
  const pathname = usePathname()
  return (
    <div className={cx('block')}>
      <div className={cx('left')}>
        <Link
          href="/notifications"
          className={cx('button', { isActive: pathname === '/notifications' })}
        >
          전체
        </Link>
        <Link
          href="/notifications/not-read"
          className={cx('button', { isActive: pathname === '/notifications/not-read' })}
        >
          읽지 않음
        </Link>
      </div>
    </div>
  )
}

export default NotificationSelector
