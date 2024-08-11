import Skeleton from '@/components/Skeleton'
import styles from './VelogFollowItem.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import SkeletonTexts from '@/components/Skeleton/SkeletonTexts'

const cx = bindClassNames(styles)

function VelogFollowItemSkeleton() {
  return (
    <div className={cx('block', 'skeletonBlock')}>
      <div>
        <Skeleton circle={true} width="56px" height="56px" />
      </div>
      <div className={cx('content')}>
        <div className={cx('username')}>
          <Skeleton width="80px" marginRight="5px" />
          <Skeleton width="60px" />
        </div>
        <div className={cx('info')}>
          <SkeletonTexts wordLengths={[2, 4, 9, 4, 7, 3]} useFlex={true} />
        </div>
      </div>
      <div className={cx('button')} />
    </div>
  )
}

export default VelogFollowItemSkeleton
