'use client'

import styles from './SettingEditButton.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {
  onClick?: () => void
  customText?: string
}

function SettingEditButton({ onClick, customText = '수정' }: Props) {
  return (
    <button className={cx('block')} onClick={onClick}>
      {customText}
    </button>
  )
}

export default SettingEditButton
