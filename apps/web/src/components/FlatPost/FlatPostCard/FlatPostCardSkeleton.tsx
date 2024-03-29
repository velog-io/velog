import Skeleton from '@/components/Skeleton'
import styles from './FlatPostCard.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import SkeletonTexts from '@/components/Skeleton/SkeletonTexts'

const cx = bindClassNames(styles)

type Props = {
  hideUser: boolean
}

function FlatPostCardSkeleton({ hideUser = false }: Props) {
  return (
    <div className={cx('block', 'skeletonBlock')}>
      {!hideUser && (
        <div className={cx('userInfo')}>
          <Skeleton className="userThumnailSkeleton" circle={true} marginRight="1rem" />
          <div className={cx('usernmae')}>
            <Skeleton width="5rem" />
          </div>
        </div>
      )}
      <div className={cx('postThumbnail')}>
        <div className={cx('thumbnailSkeletonWrapper')}>
          <Skeleton className={cx('skeleton')} />
        </div>
      </div>
      <h2>
        <SkeletonTexts wordLengths={[4, 3, 2, 5, 3, 6]} useFlex />
      </h2>
      <div className={cx('shortDescription')}>
        <div className={cx('line')}>
          <SkeletonTexts wordLengths={[2, 4, 3, 6, 2, 7]} useFlex />
        </div>
        <div className={cx('line')}>
          <SkeletonTexts wordLengths={[3, 2, 3, 4, 7, 3]} useFlex />
        </div>
        <div className={cx('line')}>
          <SkeletonTexts wordLengths={[4, 3, 3]} />
        </div>
      </div>
      <div className={cx('tagsSkeleton')}>
        <Skeleton width="6rem" marginRight="0.875rem" />
        <Skeleton width="4rem" marginRight="0.875rem" />
        <Skeleton width="5rem" noSpacing />
      </div>
      <div className={cx('subInfo')}>
        <Skeleton width="3em" marginRight="1rem" />
        <Skeleton width="6em" noSpacing />
      </div>
    </div>
  )
}

export default FlatPostCardSkeleton
