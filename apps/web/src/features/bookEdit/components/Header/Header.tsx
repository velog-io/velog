'use client'

import styles from './Header.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {}

function Header({}: Props) {
  return <div className={cx('block')}></div>
}

export default Header
