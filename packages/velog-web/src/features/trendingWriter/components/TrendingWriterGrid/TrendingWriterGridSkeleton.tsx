'use client'

import { bindClassNames } from '@/lib/styles/bindClassNames'
import styles from './TrendingWriterGrid.module.css'
import TrendingWriterCardSkeleton from '../TrendingWriterCard/TrendingWriterCardSkeleton'

const cx = bindClassNames(styles)

type Props = {}

function TrendingWriterGridSkeleton({}: Props) {
  return (
    <div className={cx('block', 'trendingWriterGrid', 'skeletonBlock')}>
      {Array.from({ length: 9 }).map((_, i) => (
        <TrendingWriterCardSkeleton key={i} />
      ))}
    </div>
  )
}

export default TrendingWriterGridSkeleton
