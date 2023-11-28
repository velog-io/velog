'use client'

import { useRef } from 'react'
import useFollowers from '../../hooks/useFollowers'
import { VelogFollowList, VelogFollowListSkeleton } from '../VelogFollowList'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import VelogFollowersEmpty from './VelogFollowersEmpty'

type Props = {
  username: string
}

function VelogFollowers({ username }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const { followers, isInitLoading, fetchMore, isFetching } = useFollowers(username)

  useInfiniteScroll(ref, fetchMore)
  console.log('isInitLoading', isInitLoading)
  if (isInitLoading) return <VelogFollowListSkeleton />
  if (followers.length === 0) return <VelogFollowersEmpty />
  return (
    <>
      <VelogFollowList data={followers} />
      {isFetching && <VelogFollowListSkeleton />}
      <div ref={ref} />
    </>
  )
}

export default VelogFollowers
