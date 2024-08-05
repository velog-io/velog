'use client'

import styles from './TrendingWriterLayout.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {
  children: React.ReactNode
}

function TrendingWriterLayout({ children }: Props) {
  return <div className={cx('block')}>{children}</div>
}

export default TrendingWriterLayout
