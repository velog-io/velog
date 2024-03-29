import styles from './PostLikeShareButtons.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {}

function PostLikeShareButtons({}: Props) {
  return <div className={cx('block')}></div>
}

export default PostLikeShareButtons
