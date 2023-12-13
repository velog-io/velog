'use client'

import styles from './SettingSocialInfoRow.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {}

function SettingSocialInfoRow({}: Props) {
  return <div className={cx('block')}></div>
}

export default SettingSocialInfoRow
