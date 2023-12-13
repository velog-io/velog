'use client'

import styles from './SettingRows.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {}

function SettingRows({}: Props) {
  return <div className={cx('block')}></div>
}

export default SettingRows
