'use client'

import { useRef } from 'react'
import useVelogPosts from '../../hooks/useVelogPosts'
import styles from './VelogPosts.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { FlatPostCardList, FlatPostCardListSkeleton } from '@/components/FlatPost/FlatPostCardList'

const cx = bindClassNames(styles)

type Props = {
  username: string
  tag: string | null
}

function VelogPosts({ username, tag }: Props) {
  const { posts, fetchNextPage, isFetching, hasNextPage, isError, isInitLoading } = useVelogPosts({
    username,
    tag,
  })
  const ref = useRef<HTMLDivElement>(null)

  const getVelogPostsMore = () => {
    if (isFetching || isError) return
    if (!hasNextPage) return
    fetchNextPage()
  }

  useInfiniteScroll(ref, getVelogPostsMore, isError)

  if (isInitLoading) return <FlatPostCardListSkeleton forLoading={true} hideUser={true} />
  return (
    <div className={cx('block')}>
      {!isInitLoading && posts.length > 0 ? (
        <FlatPostCardList posts={posts} hideUser={true} />
      ) : (
        <div className={cx('empty')}>empty</div>
      )}
      {isFetching && <FlatPostCardListSkeleton forLoading={true} hideUser={true} />}
      <div ref={ref}></div>
    </div>
  )
}

export default VelogPosts
