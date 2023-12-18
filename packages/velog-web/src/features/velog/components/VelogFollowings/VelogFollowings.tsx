'use client'

import { useRef } from 'react'
import useFollowings from '../../hooks/useFollowings'
import { VelogFollowList, VelogFollowListSkeleton } from '../VelogFollowList'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import VelogFollowingsEmpty from './VelogFollowingsEmpty'

type Props = {
  username: string
}

function VelogFollowings({ username }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const { followings, isLoading, fetchMore, isFetching } = useFollowings(username)

  useInfiniteScroll(ref, fetchMore)

  if (isLoading || isFetching) return <VelogFollowListSkeleton />
  if (followings.length === 0) return <VelogFollowingsEmpty />
  return (
    <>
      <VelogFollowList data={followings} />
      {isFetching && <VelogFollowListSkeleton />}
      <div ref={ref} />
    </>
  )
}

export default VelogFollowings
