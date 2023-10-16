import styles from './PostContent.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {}

function PostContent({}: Props) {
  return <div className={cx('block')}></div>
}

export default PostContent
