import { FlatPostCardSkeleton } from '../FlatPostCard'
import styles from './FlatPostCardList.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {
  hideUser: boolean
  forLoading: boolean
}

function FlatPostCardListSkeleton({ hideUser = false, forLoading = false }: Props) {
  return (
    <div className={cx('block')}>
      {forLoading && <div className={cx('seperator')} />}
      {Array.from({ length: forLoading ? 1 : 3 }).map((_, i) => (
        <FlatPostCardSkeleton hideUser={hideUser} key={i} />
      ))}
    </div>
  )
}

export default FlatPostCardListSkeleton
