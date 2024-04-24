'use client'

import styles from './BookEditLayout.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import NextraLayout from '@/components/Layouts/NextraLayout'

const cx = bindClassNames(styles)

type Props = {
  children: React.ReactNode
}

function BookEditLayout({ children }: Props) {
  return (
    <NextraLayout>
      <div className={cx('block')}>{children}</div>
    </NextraLayout>
  )
}

export default BookEditLayout
