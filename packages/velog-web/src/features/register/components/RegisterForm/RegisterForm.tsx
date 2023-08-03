import * as React from 'react'
import styles from './RegisterForm.module.css'
import { useState, useEffect } from 'react'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { CheckIcon } from '@/assets/icons/components'
import LabelInput from '@/components/LabelInput/LabelInput'
import useInputs from '@/hooks/useInputs'
import RoundButton from '@/components/RoundButton/RoundButton'

const cx = bindClassNames(styles)

export type RegisterFormType = {
  displayName: string
  email: string
  username: string
  shortBio: string
}

export interface RegisterFormProps {
  onSubmit: (form: RegisterFormType) => any
  fixedEmail: string | null | undefined
  error: string | null
  defaultInfo: {
    displayName: string
    username: string
  } | null
  loading: boolean
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  fixedEmail,
  error,
  defaultInfo,
  loading,
}) => {
  const [form, onChange] = useInputs({
    displayName: defaultInfo ? defaultInfo.displayName : '',
    email: '',
    username: defaultInfo ? defaultInfo.username : '',
    shortBio: '',
  })
  const [isChecked, setIsChecked] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  useEffect(() => {
    if (isChecked) {
      setLocalError(null)
    }
  }, [isChecked])

  return (
    <div className={cx('block')}>
      <LabelInput
        name="displayName"
        onChange={onChange}
        label="이름"
        placeholder="이름을 입력하세요"
        value={form.displayName}
        size={20}
      />
      {fixedEmail && (
        <LabelInput
          name="email"
          onChange={onChange}
          label="이메일"
          placeholder="이메일을 입력하세요"
          value={fixedEmail || form.email}
          disabled={!!fixedEmail}
          size={25}
        />
      )}
      <LabelInput
        name="username"
        onChange={onChange}
        label="아이디"
        placeholder="아이디를 입력하세요"
        value={form.username}
        size={15}
      />
      <LabelInput
        name="shortBio"
        onChange={onChange}
        label="한 줄 소개"
        placeholder="당신을 한 줄로 소개해보세요"
        value={form.shortBio}
        size={30}
      />
      <div
        className={cx('check-row')}
        onClick={() => {
          setIsChecked((v) => !v)
        }}
      >
        <div className={cx('box', { checked: isChecked })}>
          <CheckIcon />
        </div>
        <span>
          <a
            href="https://velog.io/policy/terms"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            이용약관
          </a>
          과{' '}
          <a
            href="https://velog.io/policy/terms"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            개인정보취급방침
          </a>
          에 동의합니다.
        </span>
      </div>
      <div className={cx('form-bottom')}>
        {(error || localError) && <div className={cx('error')}>{error || localError}</div>}
        <div className={cx('buttons')}>
          <RoundButton inline color="lightGray" to="/" size="LARGE">
            취소
          </RoundButton>
          <RoundButton
            inline
            type="submit"
            onClick={() => {
              if (!isChecked) {
                setLocalError('이용약관과 개인정보취급방침에 동의해주세요.')
                return
              }
              onSubmit({ ...form, email: fixedEmail || form.email })
            }}
            size="LARGE"
            disabled={loading}
          >
            다음
          </RoundButton>
        </div>
      </div>
    </div>
  )
}

export default RegisterForm
