'use client'

import { useRef } from 'react'
import useTrendingWriters from '../../hooks/useTrendingWriter'
import styles from './TrendingWriterGrid.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'

const cx = bindClassNames(styles)

type Props = {}

function TrendingWriterGrid({}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const { trendingWriters, fetchMore } = useTrendingWriters()

  useInfiniteScroll(ref, fetchMore)

  console.log('trendingWriters', trendingWriters)
  return (
    <>
      <div className={cx('block', 'trendingWriterGrid')}></div>
      <div ref={ref} />
    </>
  )
}

export default TrendingWriterGrid
