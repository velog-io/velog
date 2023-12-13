'use client'

import styles from './SettingRow.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {}

function SettingRow({}: Props) {
  return <div className={cx('block')}></div>
}

export default SettingRow
