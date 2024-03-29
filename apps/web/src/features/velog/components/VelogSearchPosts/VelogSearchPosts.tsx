'use client'

import { UserTags } from '@/graphql/helpers/generated'
import VelogTag from '../VelogTag'
import styles from './VelogSearchPosts.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { useRef } from 'react'

import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { FlatPostCardList, FlatPostCardListSkeleton } from '@/components/FlatPost/FlatPostCardList'
import useSearchPosts from '@/hooks/useSearchPosts'

const cx = bindClassNames(styles)

type Props = {
  username: string
  tag?: string
  userTags: UserTags
  keyword: string
}

function VelogSearchPosts({ username, tag, userTags, keyword }: Props) {
  const { posts, count, isLoading, fetchMore } = useSearchPosts({
    username,
    keyword,
  })

  const ref = useRef<HTMLDivElement>(null)
  useInfiniteScroll(ref, fetchMore)

  return (
    <div className={cx('block')}>
      <VelogTag userTags={userTags} tag={tag} username={username} />
      {!isLoading && (
        <div className={cx('info')}>
          {count === 0 ? (
            <p>검색 결과가 없습니다.</p>
          ) : (
            <p>
              총 <b>{count}개</b>의 포스트를 찾았습니다.
            </p>
          )}
        </div>
      )}
      {posts.length > 0 && <FlatPostCardList posts={posts} hideUser={true} />}
      {isLoading && <FlatPostCardListSkeleton forLoading={false} hideUser={true} />}
      <div ref={ref}></div>
    </div>
  )
}

export default VelogSearchPosts
