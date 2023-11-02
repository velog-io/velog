import styles from './FlatPostCardListSkeleton.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {}

function FlatPostCardListSkeleton({}: Props) {
  return <div className={cx('block')}></div>
}

export default FlatPostCardListSkeleton
