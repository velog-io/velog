'use client'

import styles from './SettingInput.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {}

function SettingInput({}: Props) {
  return <div className={cx('block')}></div>
}

export default SettingInput
