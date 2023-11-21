'use client'

import { useRef } from 'react'
import useFollowers from '../../hooks/useFollowers'
import { VelogFollowList, VelogFollowListSkeleton } from '../VelogFollowList'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'

type Props = {
  username: string
}

function VelogFollowers({ username }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const { followers, isInitLoading, fetchMore } = useFollowers(username)

  useInfiniteScroll(ref, fetchMore)

  if (isInitLoading) return <VelogFollowListSkeleton />

  return (
    <>
      <VelogFollowList data={followers} />
      <div ref={ref} />
    </>
  )
}

export default VelogFollowers
