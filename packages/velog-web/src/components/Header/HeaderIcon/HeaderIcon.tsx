'use client'

import styles from './HeaderIcon.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {
  children: React.ReactNode
  className?: string
}

function HeaderIcon({ children, className }: Props) {
  return <div className={cx('block', className)}>{children}</div>
}

export default HeaderIcon
