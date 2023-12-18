'use client'

import styles from './PostCardGrid.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import PostCard from '@/features/home/components/PostCard/PostCard'
import { Timeframe } from '@/features/home/state/timeframe'
import { useParams, usePathname } from 'next/navigation'

import { Post } from '@/graphql/helpers/generated'
import PostCardSkeletonGrid from './PostCardSkeletonGrid'
import { ENV } from '@/env'
import { PostCardSkeleton } from '../PostCard/PostCardSkeleton'
import { nanoid } from 'nanoid'
import { Fragment } from 'react'

const cx = bindClassNames(styles)

type Props = {
  posts: Post[]
  forHome: boolean
  forPost: boolean
  isFetching: boolean
  isLoading: boolean
  fetchMore: () => void
}

function PostCardGrid({
  posts = [],
  forHome = false,
  forPost = false,
  isFetching,
  isLoading,
  fetchMore,
}: Props) {
  const params = useParams()
  const pathname = usePathname()
  const timeframe = (params.timeframe ?? 'week') as Timeframe

  const isFeed = pathname === '/feed'
  const isRecent = pathname === '/recent'
  // TODO: remove
  const onPostCardClick = () => {
    const prefix = isRecent ? 'recentPosts' : !isFeed ? `trendingPosts/${timeframe}` : ''

    const stringify = JSON.stringify(posts)
    const scrollHeight = window.scrollY.toString()
    if (scrollHeight === '0' || [scrollHeight, stringify].includes('undefined')) return
    localStorage.setItem(prefix, stringify)
    localStorage.setItem(`${prefix}/scrollPosition`, scrollHeight)
  }

  if (isLoading) return <PostCardSkeletonGrid forHome={forHome} forPost={forPost} />

  return (
    <ul className={cx('block', 'homeGrid')}>
      {posts.map((post, i) => (
        <Fragment key={post.id}>
          <PostCard post={post} forHome={forHome} forPost={forPost} onClick={onPostCardClick} />
          {posts.length - 1 === i && !isFeed && (
            <PostCardSkeleton forHome={forHome} forPost={forPost} fetchMore={fetchMore} />
          )}
        </Fragment>
      ))}
      {isFetching &&
        Array(ENV.defaultPostLimit)
          .fill(0)
          .map(() => <PostCardSkeleton key={nanoid()} forHome={forHome} forPost={forPost} />)}
    </ul>
  )
}

export default PostCardGrid
