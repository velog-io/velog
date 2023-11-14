'use client'

import { useRef } from 'react'
import useVelogPosts from '../../hooks/useVelogPosts'
import styles from './VelogPosts.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { FlatPostCardList, FlatPostCardListSkeleton } from '@/components/FlatPost/FlatPostCardList'
import { UndrawBlankCanvas } from '@/assets/vectors/components'
import VelogTag from '../VelogTag'
import { UserTags } from '@/graphql/generated'

const cx = bindClassNames(styles)

type Props = {
  username: string
  tag?: string
  userTags: UserTags
}

function VelogPosts({ username, tag, userTags }: Props) {
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

  if (isInitLoading) return <FlatPostCardListSkeleton forLoading={false} hideUser={true} />

  return (
    <>
      <VelogTag userTags={userTags} tag={tag} username={username} />
      <div className={cx('block')}>
        {!isInitLoading && posts.length > 0 ? (
          <FlatPostCardList posts={posts} hideUser={true} />
        ) : (
          <div className={cx('empty')}>
            <UndrawBlankCanvas width={320} height={320} />
            <div className={cx('message')}>포스트가 없습니다.</div>
          </div>
        )}
        {isFetching && <FlatPostCardListSkeleton forLoading={true} hideUser={true} />}
        <div ref={ref}></div>
      </div>
    </>
  )
}

export default VelogPosts
