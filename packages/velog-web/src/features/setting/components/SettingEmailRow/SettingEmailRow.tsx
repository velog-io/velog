'use client'

import { useState } from 'react'
import SettingRow from '../SettingRow'
import styles from './SettingEmailRow.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import useInput from '@/hooks/useInput'
import Button from '@/components/Button'
import SettingInput from '../SettingInput'
import SettingEmailSuccess from '../SettingEmailSuccess'

const cx = bindClassNames(styles)

type Props = {
  email: string
}

function SettingEmailRow({ email }: Props) {
  const [edit, setEdit] = useState(false)
  const [value, onChange] = useInput(email ?? '')

  const onSubmit = async (e: React.FormEvent) => {}
  const isLoading = false
  return (
    <SettingRow
      title="이메일 주소"
      description="회원 인증 또는 시스템에서 발송하는 이메일을 수신하는 주소입니다."
      editButton={!edit}
      showEditButton={true}
      onClickEdit={() => setEdit(true)}
      editButtonText="변경"
    >
      {edit ? (
        <div className={cx('form')} onSubmit={onSubmit}>
          <SettingInput
            value={value}
            onChange={onChange}
            placeholder="이메일"
            disabled={isLoading}
          />
          <Button disabled={isLoading}>변경</Button>
        </div>
      ) : false ? (
        <SettingEmailSuccess />
      ) : (
        email
      )}
    </SettingRow>
  )
}

export default SettingEmailRow
