'use client'

import { useRef } from 'react'
import useFollowings from '../../hooks/useFollowings'
import { VelogFollowList, VelogFollowListSkeleton } from '../VelogFollowList'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'

type Props = {
  username: string
}

function VelogFollowings({ username }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const { followings, isInitLoading, fetchMore } = useFollowings(username)

  useInfiniteScroll(ref, fetchMore)

  if (isInitLoading) return <VelogFollowListSkeleton />

  return (
    <>
      <VelogFollowList data={followings} />
      <div ref={ref} />
    </>
  )
}

export default VelogFollowings
