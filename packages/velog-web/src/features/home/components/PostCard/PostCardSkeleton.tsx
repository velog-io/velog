import Skeleton from '@/components/Skeleton/Skeleton'
import styles from './PostCard.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import SkeletonTexts from '@/components/Skeleton/SkeletonTexts'
import { useRef } from 'react'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'

const cx = bindClassNames(styles)

export function PostCardSkeleton({
  forHome = false,
  forPost = false,
  fetchMore = () => {},
}: {
  forHome: boolean
  forPost: boolean
  fetchMore?: () => void
}) {
  const ref = useRef<HTMLLIElement>(null)
  useInfiniteScroll(ref, fetchMore)
  return (
    <li
      ref={ref}
      className={cx('block', 'skeletonBlock', {
        isNotHomeAndPost: !forHome && !forPost,
      })}
    >
      <div className={cx('skeletonThumbnailWrapper')}>
        <Skeleton className={cx('skeletonThumbnail')} />
      </div>
      <div className={cx('content')}>
        <h4>
          <SkeletonTexts wordLengths={[2, 4, 3, 6, 5]} />
        </h4>
        <div className={cx('descriptionWrapper')}>
          <div className={cx('lines')}>
            <div className={cx('line')}>
              <SkeletonTexts wordLengths={[2, 4, 3, 6, 2, 7]} useFlex />
            </div>
            <div className="line">
              <SkeletonTexts wordLengths={[3, 2]} />
            </div>
          </div>
        </div>
        <div className={cx('subInfo')}>
          <span>
            <Skeleton width="3rem" />
          </span>
          <span className={cx('separator')}></span>
          <span>
            <Skeleton width="4rem" />
          </span>
        </div>
      </div>
      <div className={cx('footer')}>
        <div className={cx('userInfo')}>
          <Skeleton width="1.5rem" height="1.5rem" marginRight="0.5rem" circle />
          <span>
            <Skeleton width="6rem" />
          </span>
        </div>
      </div>
    </li>
  )
}
