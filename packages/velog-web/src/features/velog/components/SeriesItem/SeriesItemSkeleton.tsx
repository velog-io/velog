import Skeleton from '@/components/Skeleton'
import styles from './SeriesItem.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import SkeletonTexts from '@/components/Skeleton/SkeletonTexts'

const cx = bindClassNames(styles)

function SeriesItemSkeleton() {
  return (
    <div className={cx('block', 'skeletonBlock')}>
      <div className={cx('imageSkeletonWrapper')}>
        <Skeleton className={cx('skeleton')} />
      </div>
      <h4>
        <SkeletonTexts wordLengths={[5, 3, 2, 2]} />
      </h4>
      <div className={cx('info')}>
        <Skeleton width="5rem" marginRight="1.5rem" />
        <Skeleton width="8rem" noSpacing />
      </div>
    </div>
  )
}

export default SeriesItemSkeleton
