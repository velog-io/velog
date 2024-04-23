'use client'

import styles from './BookEditLayout.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {
  children: React.ReactNode
}

function BookEditLayout({ children }: Props) {
  return <div className={cx('block')}>{children}</div>
}

export default BookEditLayout
