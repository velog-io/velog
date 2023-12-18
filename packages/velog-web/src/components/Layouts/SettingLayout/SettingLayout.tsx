'use client'

import styles from './SettingLayout.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {}

function SettingLayout({}: Props) {
  return <div className={cx('block')}></div>
}

export default SettingLayout
