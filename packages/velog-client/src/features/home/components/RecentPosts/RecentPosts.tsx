import styles from './RecentPosts.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {}

function RecentPosts({}: Props) {
  return <div className={cx('block')}></div>
}

export default RecentPosts
