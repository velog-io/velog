'use client'

import { useCallback, useEffect, useState } from 'react'
import SettingRow from '../SettingRow'
import styles from './SettingEmailRow.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import useInput from '@/hooks/useInput'
import Button from '@/components/Button'
import SettingInput from '../SettingInput'
import SettingEmailSuccess from '../SettingEmailSuccess'
import { validateEmail } from '@/lib/validate'
import { toast } from 'react-toastify'
import {
  useCheckEmailExistsQuery,
  useInitiateChangeEmailMutation,
} from '@/graphql/helpers/generated'

const cx = bindClassNames(styles)

type Props = {
  email: string
}

function SettingEmailRow({ email }: Props) {
  const [edit, setEdit] = useState(false)
  const [value, onChange] = useInput(email ?? '')
  const [checkEmail, setCheckEmail] = useState(false)
  const [isEmailSent, setEmailSent] = useState(false)
  const { data: checkEmailExistsData, isLoading } = useCheckEmailExistsQuery(
    { input: { email: value.trim() } },
    { networkMode: 'always', enabled: checkEmail },
  )

  const { mutateAsync } = useInitiateChangeEmailMutation()

  useEffect(() => {
    if (isLoading) return
    if (checkEmail && checkEmailExistsData === undefined) {
      toast.error('이메일 확인 중입니다. 잠시 후 다시 시도해주세요.')
      return
    }
  }, [checkEmail, checkEmailExistsData, isLoading])

  const onSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault()

      if (!validateEmail(value)) {
        toast.error('잘못된 이메일 형식입니다.')
        return
      }

      if (value === email) {
        toast.error('새 이메일 주소가 현재 이메일과 동일합니다.')
        return
      }

      setCheckEmail(true)
      if (checkEmailExistsData?.checkEmailExists) {
        toast.error('동일한 이메일이 존재합니다.')
        return
      }

      setEmailSent(true)
      await mutateAsync({ input: { email: value.trim() } })
      setEdit(false)
      setCheckEmail(false)
    },
    [email, checkEmailExistsData, mutateAsync, value],
  )

  return (
    <SettingRow
      title="이메일 주소"
      description="회원 인증 또는 시스템에서 발송하는 이메일을 수신하는 주소입니다."
      editButton={!edit}
      showEditButton={!isEmailSent}
      onClickEdit={() => setEdit(true)}
      editButtonText="변경"
      className={cx('block')}
    >
      {edit ? (
        <form className={cx('form')} onSubmit={onSubmit}>
          <SettingInput
            value={value}
            onChange={onChange}
            placeholder="이메일"
            disabled={isLoading}
          />
          <Button disabled={isLoading}>변경</Button>
        </form>
      ) : isEmailSent ? (
        <SettingEmailSuccess />
      ) : (
        email
      )}
    </SettingRow>
  )
}

export default SettingEmailRow
