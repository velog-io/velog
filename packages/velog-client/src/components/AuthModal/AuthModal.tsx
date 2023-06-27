import Modal from '@/components/Modal/Modal'
import styles from './AuthModal.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { useModal } from '@/state/modal'
import Image from 'next/image'
import { MdClose } from 'react-icons/md'

const cx = bindClassNames(styles)

type Props = {
  children: React.ReactNode
}

function AuthModal({ children }: Props) {
  const {
    value: { isVisible },
    actions,
  } = useModal()

  return (
    <Modal isVisible={isVisible} onOverlayClick={() => actions.closeModal()}>
      <div
        className={cx(
          'wrapper',
          isVisible ? 'pop-in-from-bottom' : 'pop-out-to-Bottom'
        )}
      >
        <div className={cx('gray-block')}>
          <div>
            <Image
              src="/images/undraw_joyride_hnno.svg"
              width={168}
              height={108}
              alt="welcome"
            />
            <div className={cx('welcome')}>환영합니다!</div>
          </div>
        </div>
        <div className={cx('white-block')}>
          <div className={cx('exit-wrapper')}>
            <MdClose onClick={() => actions.closeModal()} tabIndex={1} />
          </div>
          <div className={cx('block-content')}>{children}</div>
        </div>
      </div>
    </Modal>
  )
}

export default AuthModal
