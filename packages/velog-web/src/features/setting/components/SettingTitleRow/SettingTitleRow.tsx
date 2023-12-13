'use client'

import styles from './SettingTitleRow.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {}

function SettingTitleRow({}: Props) {
  return <div className={cx('block')}></div>
}

export default SettingTitleRow
