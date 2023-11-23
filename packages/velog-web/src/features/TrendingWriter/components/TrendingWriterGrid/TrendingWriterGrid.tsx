'use client'

import { useRef } from 'react'
import useTrendingWriters from '../../hooks/useTrendingWriter'
import styles from './TrendingWriterGrid.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import TrendingWriterGridSkeleton from './TrendingWriterGridSkeleton'
import TrendingWriterCardSkeleton from '../TrendingWriterCard/TrendingWriterCardSkeleton'

const cx = bindClassNames(styles)

type Props = {}

function TrendingWriterGrid({}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const { trendingWriters, fetchMore, isInitLoading, isFetching } = useTrendingWriters()

  useInfiniteScroll(ref, fetchMore)
  if (!isInitLoading) return <TrendingWriterGridSkeleton />
  return (
    <>
      <div className={cx('block', 'trendingWriterGrid')}></div>
      {isFetching &&
        Array.from({ length: 3 }).map((_, i) => <TrendingWriterCardSkeleton key={i} />)}
      <div ref={ref} />
    </>
  )
}

export default TrendingWriterGrid
