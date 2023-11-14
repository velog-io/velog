'use client'

import styles from './PostCardGrid.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import PostCard from '@/features/home/components/PostCard/PostCard'
import { PostCardSkeleton } from '@/features/home/components/PostCard/PostCardSkeleton'
import { ENV } from '@/env'
import { Timeframe } from '@/features/home/state/timeframe'
import { useParams, usePathname } from 'next/navigation'
import { InfiniteData } from '@tanstack/react-query'
import { Post, RecentPostsQuery, TrendingPostsQuery } from '@/graphql/generated'

const cx = bindClassNames(styles)

type Props = {
  posts: Post[]
  forHome: boolean
  forPost: boolean
  originData?: InfiniteData<TrendingPostsQuery | RecentPostsQuery>
  loading?: boolean
}

function PostCardGrid({
  posts = [],
  forHome = false,
  forPost = false,
  loading = false,
  originData,
}: Props) {
  const params = useParams()
  const pathname = usePathname()
  const timeframe = (params.timeframe ?? 'week') as Timeframe

  // TODO: remove
  const onPostCardClick = () => {
    const isRecent = pathname === '/recent'
    const prefix = isRecent ? 'recentPosts' : `trendingPosts/${timeframe}`

    const serialized = JSON.stringify(originData)
    const scrollHeight = window.scrollY.toString()
    if (scrollHeight === '0' || [scrollHeight, serialized].includes('undefined')) return
    localStorage.setItem(prefix, serialized)
    localStorage.setItem(`${prefix}/scrollPosition`, scrollHeight)
  }

  return (
    <div className={cx('block', 'homePostCardGrid')}>
      {posts.map((post) => {
        return (
          <PostCard
            key={post.id}
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
