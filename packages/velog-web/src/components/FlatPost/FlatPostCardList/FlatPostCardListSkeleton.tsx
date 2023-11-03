import styles from './FlatPostCardList.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {
  hideUser: boolean
  forLoading: boolean
}

function FlatPostCardListSkeleton({ hideUser = false, forLoading = false }: Props) {
  return <div className={cx('block')}>{forLoading && <div className={cx('seperator')} />}</div>
}

export default FlatPostCardListSkeleton
