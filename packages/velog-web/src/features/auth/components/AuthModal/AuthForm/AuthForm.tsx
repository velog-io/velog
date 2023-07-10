import { ModalMode, useModal } from '@/state/modal'
import styles from './AuthForm.module.css'
import useRequest from '@/hooks/useRequest'
import { SendAuthEmailResponse, sendAuthEmail } from '@/lib/api/auth'
import { useCallback } from 'react'
import AuthEmailSuccess from '@/features/auth/components/AuthModal/AuthEmailSuccess/AuthEmailSuccess'
import AuthEmailForm from '@/features/auth/components/AuthModal/AuthEmailForm/AuthEmailForm'
import useInput from '@/hooks/useInput'
import { validateEmail } from '@/lib/validate'
import { toast } from 'react-toastify'
import AuthSocialButtonGroup from '@/features/auth/components/AuthModal/AuthSocialButtonGroup/AuthSocialButtonGroup'

import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

function AuthForm() {
  const {
    actions,
    value: { mode },
  } = useModal()
  const [email, onChangeEmail] = useInput('')
  const [_sendAuthEmail, loading, data, , resetSendAuthEmail] =
    useRequest<SendAuthEmailResponse>(sendAuthEmail)

  const onClose = useCallback(() => {
    actions.closeModal()
    resetSendAuthEmail()
  }, [actions, resetSendAuthEmail])

  const onToggleMode = useCallback(() => {
    const nextMode = mode === 'register' ? 'login' : 'register'
    actions.changeMode(nextMode)
  }, [actions, mode])

  const registered = data && data.registered

  const modeText = mode === 'register' ? '회원가입' : '로그인'

  const onSendAuthEmail = useCallback(
    async (email: string) => {
      if (!validateEmail(email)) {
        toast.error('잘못된 이메일 형식입니다.')
        return
      }
      _sendAuthEmail(email)
    },
    [_sendAuthEmail]
  )

  return (
    <div className={cx('block')}>
      <div className={cx('upper-warepper')}>
        <h2 data-testid="title">{modeText}</h2>
        <section>
          <h4>이메일로 {modeText}</h4>
          {registered !== null ? (
            <AuthEmailSuccess registered={registered} />
          ) : (
            <AuthEmailForm
              value={email}
              onChange={onChangeEmail}
              onSubmit={onSendAuthEmail}
              disabled={loading}
            />
          )}
        </section>
        <section>
          <h4>소셜 계정으로 {modeText}</h4>
          <AuthSocialButtonGroup />
        </section>
      </div>
      <div className={cx('foot')}>
        <span>
          {mode === 'login'
            ? '아직 회원이 아니신가요?'
            : '계정이 이미 있으신가요?'}
        </span>
        <div
          className={cx('link')}
          tabIndex={7}
          onClick={onToggleMode}
          data-testid="switchmode"
        >
          {mode === 'login' ? '회원가입' : '로그인'}
        </div>
      </div>
    </div>
  )
}

export default AuthForm
