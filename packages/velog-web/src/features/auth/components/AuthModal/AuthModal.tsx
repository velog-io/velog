'use client'

import styles from './AuthModal.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { useModal } from '@/state/modal'
import { MdClose } from 'react-icons/md'
import AuthForm from '@/features/auth/components/AuthModal/AuthForm'
import Modal from '@/components/Modal'
import { UndrawJoyrideHnno } from '@/assets/vectors/components'

const cx = bindClassNames(styles)

function AuthModal() {
  const {
    value: { isVisible, mode },
    actions,
  } = useModal()

  if (!['register', 'login', ''].includes(mode)) {
    throw new Error('Invalid mode')
  }

  return (
    <Modal isVisible={isVisible} onOverlayClick={() => actions.closeModal()}>
      <div className={cx('wrapper', isVisible ? 'popInFromBottom' : 'popOutToBottom')}>
        <div className={cx('gray-block')}>
          <div>
            <UndrawJoyrideHnno width={168} height={108} />
            <div className={cx('welcome')}>환영합니다!</div>
          </div>
        </div>
        <div className={cx('white-block')}>
          <div className={cx('exit-wrapper')}>
            <MdClose onClick={() => actions.closeModal()} tabIndex={1} />
          </div>
          <div className={cx('block-content')}>
            <AuthForm />
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default AuthModal
