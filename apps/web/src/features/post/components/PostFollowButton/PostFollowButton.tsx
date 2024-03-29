import styles from './PostFollowButton.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {}

function PostFollowButton({}: Props) {
  return <div className={cx('block')}></div>
}

export default PostFollowButton
