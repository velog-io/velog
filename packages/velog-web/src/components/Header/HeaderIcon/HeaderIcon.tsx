'use client'

import styles from './HeaderIcon.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {
  children: React.ReactNode
}

function HeaderIcon({ children }: Props) {
  return <div className={cx('block')}>{children}</div>
}

export default HeaderIcon
