import styles from './PostToc.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {}

function PostToc({}: Props) {
  return <div className={cx('block')}></div>
}

export default PostToc
