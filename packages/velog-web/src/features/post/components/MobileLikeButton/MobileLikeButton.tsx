import styles from './MobileLikeButton.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {}

function MobileLikeButton({}: Props) {
  return <div className={cx('block')}></div>
}

export default MobileLikeButton
