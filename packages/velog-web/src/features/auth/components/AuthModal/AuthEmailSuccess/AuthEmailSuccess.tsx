import { MdCheck } from 'react-icons/md'
import styles from './AuthEmailSuccess.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {
  registered: boolean
}

function AuthEmailSuccess({ registered }: Props) {
  const text = registered ? '로그인' : '회원가입'
  return (
    <div className={cx('block')}>
      <MdCheck className={cx('icon')} />
      <div className={cx('description')}>{text} 링크가 이메일로 전송되었습니다.</div>
    </div>
  )
}

export default AuthEmailSuccess
