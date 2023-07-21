'use client'

import { Posts } from '@/types/post'
import styles from './PostCardGrid.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import PostCard from '@/features/post/components/PostCard/PostCard'
import { PostCardSkeleton } from '@/features/post/components/PostCard/PostCardSkeleton'
import { ENV } from '@/env'
import { Timeframe } from '@/features/home/state/timeframe'
import { usePathname, useSearchParams } from 'next/navigation'
import { InfiniteData } from '@tanstack/react-query'
import { TrendingPostsQuery } from '@/graphql/generated'

const cx = bindClassNames(styles)

type Props = {
  posts: Posts[]
  originData: InfiniteData<TrendingPostsQuery> | undefined
  forHome: boolean
  forPost: boolean
  loading?: boolean
}

function PostCardGrid({
  posts = [],
  forHome = false,
  forPost = false,
  loading = false,
  originData,
}: Props) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const timeframe = (searchParams.get('timeframe') ?? 'week') as Timeframe

  // TODO: remove
  const onPostCardClick = () => {
    const isRecent = pathname === '/recent'
    const postsName = isRecent ? 'recentPosts' : `trendingPosts/${timeframe}`

    const serialized = JSON.stringify(originData)
    localStorage.setItem(postsName, serialized)
    localStorage.setItem('scrollPosition', window.scrollY.toString())
  }

  return (
    <div className={cx('block')}>
      {posts.map((post) => {
        return (
          <PostCard
            key={`${post.id}`}
            post={post}
            forHome={forHome}
            forPost={forPost}
            onClick={onPostCardClick}
          />
        )
      })}
      {loading &&
        Array(ENV.defaultPostLimit)
          .fill(0)
          .map((_, i) => <PostCardSkeleton key={i} forHome={forHome} forPost={forPost} />)}
    </div>
  )
}

export default PostCardGrid
