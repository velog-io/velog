'use client'

import styles from './SettingEmailRow.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {}

function SettingEmailRow({}: Props) {
  return <div className={cx('block')}></div>
}

export default SettingEmailRow
