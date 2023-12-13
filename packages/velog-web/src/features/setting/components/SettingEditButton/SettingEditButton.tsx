'use client'

import styles from './SettingEditButton.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {}

function SettingEditButton({}: Props) {
  return <div className={cx('block')}></div>
}

export default SettingEditButton
