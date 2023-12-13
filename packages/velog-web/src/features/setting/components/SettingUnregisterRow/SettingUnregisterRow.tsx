'use client'

import styles from './SettingUnregisterRow.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {}

function SettingUnregisterRow({}: Props) {
  return <div className={cx('block')}></div>
}

export default SettingUnregisterRow
