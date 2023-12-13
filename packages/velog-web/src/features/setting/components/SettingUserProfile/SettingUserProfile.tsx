'use client'

import styles from './SettingUserProfile.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {}

function SettingUserProfile({}: Props) {
  return <div className={cx('block')}></div>
}

export default SettingUserProfile
