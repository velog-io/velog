import styles from './PostHead.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {}

function PostHead({}: Props) {
  return <div className={cx('block')}></div>
}

export default PostHead
