'use client'

import { useState } from 'react'
import styles from './SettingUnregisterRow.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import SettingRow from '../SettingRow'
import Button from '@/components/Button'
import PopupOKCancel from '@/components/PopupOKCancel'

const cx = bindClassNames(styles)

type Props = {}

function SettingUnregisterRow({}: Props) {
  const [ask, setAsk] = useState(false)
  const onUnregister = () => {}
  return (
    <>
      <SettingRow
        title="회원 탈퇴"
        description="탈퇴 시 작성하신 포스트 및 댓글이 모두 삭제되며 복구되지 않습니다."
      >
        <Button color="red" onClick={() => setAsk(true)}>
          회원 탈퇴
        </Button>
      </SettingRow>
      <PopupOKCancel
        title="회원 탈퇴"
        isVisible={ask}
        onCancel={() => setAsk(false)}
        onConfirm={onUnregister}
      >
        정말로 탈퇴 하시겠습니까?
      </PopupOKCancel>
    </>
  )
}

export default SettingUnregisterRow
