'use client'

import { bindClassNames } from '@/lib/styles/bindClassNames'
import styles from './TrendingWriterCard.module.css'
import Skeleton from '@/components/Skeleton'
import SkeletonTexts from '@/components/Skeleton/SkeletonTexts'

const cx = bindClassNames(styles)

type Props = {}

function TrendingWriterCardSkeleton({}: Props) {
  return (
    <li className={cx('block', 'skeletonBlock')}>
      <div className={cx('header')}>
        <Skeleton
          width="32px"
          height="32px"
          circle={true}
          marginRight="5px"
          className={cx('thumbnail')}
        />
        <Skeleton height="18px" marginRight="auto" className={cx('displayName')} />
        <Skeleton width="70px" height="20px" className={cx('button')} />
      </div>
      <div className={cx('content')}>
        <SkeletonTexts wordLengths={[3, 2, 4]} className={cx('pc')} />
        <SkeletonTexts wordLengths={[7, 2, 4, 2]} className={cx('mobile')} />
        <div className={cx('spacer')} />
        <SkeletonTexts wordLengths={[4, 2, 6]} className={cx('pc')} />
        <SkeletonTexts wordLengths={[3, 2, 4, 1, 3]} className={cx('mobile')} />
        <div className={cx('spacer')} />
        <SkeletonTexts wordLengths={[1, 8, 3]} className={cx('pc')} />
        <SkeletonTexts wordLengths={[4, 8, 2]} className={cx('mobile')} />
      </div>
    </li>
  )
}

export default TrendingWriterCardSkeleton
