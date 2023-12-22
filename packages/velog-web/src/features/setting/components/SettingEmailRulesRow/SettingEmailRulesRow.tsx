'use client'

import ToggleSwitch from '@/components/ToggleSwitch'
import SettingRow from '../SettingRow'
import styles from './SettingEmailRulesRow.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { useCallback, useEffect, useRef, useState } from 'react'

const cx = bindClassNames(styles)

type Props = {
  notification: boolean
  promotion: boolean
}

function SettingEmailRulesRow({ notification, promotion }: Props) {
  const mounted = useRef(false)
  const [values, setValues] = useState({ promotion, notification })

  const onChange = useCallback(({ name, value }: { name: string; value: boolean }) => {
    setValues((prev) => ({ ...prev, [name]: value }))
  }, [])

  useEffect(() => {
    mounted.current = true
  }, [])

  return (
    <SettingRow title="이메일 수신 설정">
      <ul className={cx('rules')}>
        <li>
          <span>댓글 알림</span>
          <ToggleSwitch value={values.notification} name="notification" onChange={onChange} />
        </li>
        <li>
          <span>벨로그 업데이트 소식</span>
          <ToggleSwitch value={values.promotion} name="promotion" onChange={onChange} />
        </li>
      </ul>
    </SettingRow>
  )
}

export default SettingEmailRulesRow
