'use client'

import styles from './SettingEmailSuccess.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {}

function SettingEmailSuccess({}: Props) {
  return <div className={cx('block')}></div>
}

export default SettingEmailSuccess
