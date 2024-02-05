'use client'

import { MdCheck } from 'react-icons/md'
import styles from './SettingEmailSuccess.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {}

function SettingEmailSuccess({}: Props) {
  return (
    <div className={cx('block')}>
      <MdCheck className={cx('icon')} />
      <div className="text">메일이 전송되었습니다. 받은 편지함을 확인하세요.</div>
    </div>
  )
}

export default SettingEmailSuccess
