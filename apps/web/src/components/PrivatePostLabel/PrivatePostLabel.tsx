import { LockIcon } from '@/assets/icons/components'
import styles from './PrivatePostLabel.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {}

function PrivatePostLabel({}: Props) {
  return (
    <div className={cx('block')}>
      <LockIcon /> 비공개
    </div>
  )
}

export default PrivatePostLabel
