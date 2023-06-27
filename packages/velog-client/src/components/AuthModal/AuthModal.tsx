import Modal from '@/components/Modal/Modal'
import styles from './AuthModal.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { useModal } from '@/state/modal'

const cx = bindClassNames(styles)

type Props = {}

function AuthModal({}: Props) {
  const {
    value: { isVisible },
    actions,
  } = useModal()
  
  return (
    <Modal isVisible={isVisible} onOverlayClick={() => actions.closeModal()}>
      <div
        className={cx(
          'block',
          isVisible ? 'pop-in-from-bottom' : 'pop-out-to-Bottom'
        )}
      >
        modal
      </div>
    </Modal>
  )
}

export default AuthModal
