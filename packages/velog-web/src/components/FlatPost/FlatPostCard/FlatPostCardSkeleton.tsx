import styles from './FlatPostCard.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {
  hideUser: boolean
}

function FlatPostCardSkeleton({ hideUser = false }: Props) {
  return <div className={cx('block', 'skeleton')}></div>
}

export default FlatPostCardSkeleton
