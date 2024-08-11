'use client'

import styles from './CenterLayout.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {
  children: React.ReactNode
}

function CenterLayout({ children }: Props) {
  return <div className={cx('block')}>{children}</div>
}

export default CenterLayout
