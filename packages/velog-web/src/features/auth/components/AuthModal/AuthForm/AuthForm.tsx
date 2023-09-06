import { useModal } from '@/state/modal'
import styles from './AuthForm.module.css'
import { useCallback, useEffect, useState } from 'react'
import AuthEmailSuccess from '@/features/auth/components/AuthModal/AuthEmailSuccess'
import AuthEmailForm from '@/features/auth/components/AuthModal/AuthEmailForm'
import useInput from '@/hooks/useInput'
import { validateEmail } from '@/lib/validate'
import { toast } from 'react-toastify'
import AuthSocialButtonGroup from '@/features/auth/components/AuthModal/AuthSocialButtonGroup'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { useSendMailMutation } from '@/graphql/generated'

const cx = bindClassNames(styles)

function AuthForm() {
  const {
    actions,
    value: { mode, isVisible },
  } = useModal()
  const [email, onChangeEmail] = useInput('')
  const [isSendEmail, setSendEmail] = useState(false)

  const { mutate, data, isLoading } = useSendMailMutation({})

  const onToggleMode = useCallback(() => {
    const nextMode = mode === 'register' ? 'login' : 'register'
    actions.changeMode(nextMode)
  }, [actions, mode])

  const registered = (data && data.sendMail?.registered) || false
  const modeText = mode === 'register' ? '회원가입' : '로그인'

  const onSendAuthEmail = useCallback(
    (email: string) => {
      if (!validateEmail(email)) {
        toast.error('잘못된 이메일 형식입니다.')
        return
      }
      mutate({ input: { email } })
      setSendEmail(true)
    },
    [mutate],
  )

  useEffect(() => {
    if (!isVisible) {
      setSendEmail(false)
    }
  }, [isVisible])

  return (
    <div className={cx('block')}>
      <div className={cx('upper-warepper')}>
        <h2 data-testid="title">{modeText}</h2>
        <section>
          <h4>이메일로 {modeText}</h4>
          {isSendEmail ? (
            <AuthEmailSuccess registered={registered} />
          ) : (
            <AuthEmailForm
              value={email}
              onChange={onChangeEmail}
              onSubmit={onSendAuthEmail}
              disabled={isLoading}
            />
          )}
        </section>
        <section>
          <h4>소셜 계정으로 {modeText}</h4>
          <AuthSocialButtonGroup />
        </section>
      </div>
      <div className={cx('foot')}>
        <span>{mode === 'login' ? '아직 회원이 아니신가요?' : '계정이 이미 있으신가요?'}</span>
        <div className={cx('link')} tabIndex={7} onClick={onToggleMode} data-testid="switchmode">
          {mode === 'login' ? '회원가입' : '로그인'}
        </div>
      </div>
    </div>
  )
}

export default AuthForm
