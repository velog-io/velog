'use client'

import styles from './SettingEmailRulesRow.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {}

function SettingEmailRulesRow({}: Props) {
  return <div className={cx('block')}></div>
}

export default SettingEmailRulesRow