'use client'

import { useRef } from 'react'
import useVelogPosts from '../../hooks/useVelogPosts'
import styles from './VelogPosts.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { FlatPostCardList, FlatPostCardListSkeleton } from '@/components/FlatPost/FlatPostCardList'
import { UndrawBlankCanvas } from '@/assets/vectors/components'
import VelogTag from '../VelogTag'
import { Post, UserTags } from '@/graphql/server/generated/server'

const cx = bindClassNames(styles)

type Props = {
  username: string
  tag?: string
  userTags: UserTags
  initialData: Post[]
}

function VelogPosts({ username, tag, userTags, initialData }: Props) {
  const { posts, isFetching, fetchMore, isLoading } = useVelogPosts({
    username,
    tag,
    initialData,
  })

  const ref = useRef<HTMLDivElement>(null)
  useInfiniteScroll(ref, fetchMore)

  if (isLoading) return <FlatPostCardListSkeleton forLoading={false} hideUser={true} />

  return (
    <div className={cx('block')}>
      <VelogTag userTags={userTags} tag={tag} username={username} />
      {posts.length > 0 ? (
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
  )
}

export default VelogPosts
