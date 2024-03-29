import { useModal } from '@/state/modal'
import styles from './AuthEmailForm.module.css'

import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (value: string) => void
  disabled: boolean
}

function AuthEmailForm({ value, onChange, onSubmit, disabled }: Props) {
  const {
    value: { mode },
  } = useModal()

  return (
    <form
      className={cx('block')}
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(value)
      }}
    >
      <input
        onChange={onChange}
        value={value}
        tabIndex={2}
        placeholder="이메일을 입력하세요."
        disabled={disabled}
      />
      <button tabIndex={3} disabled={disabled}>
        {mode === 'register' ? '회원가입' : '로그인'}
      </button>
    </form>
  )
}

export default AuthEmailForm
