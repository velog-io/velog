'use client'

import styles from './PostCardGrid.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

import { ENV } from '@/env'
import { Timeframe } from '@/features/home/state/timeframe'
import { useParams, usePathname } from 'next/navigation'
import AdPostCard from '../PostCard/AdPostCard'

import { Fragment, useEffect, useRef } from 'react'
import { Post } from '@/graphql/helpers/generated'
import PostCardSkeletonGrid from './PostCardSkeletonGrid'
import { TrendingPost } from '../../interface/post'
import PostCard from '../PostCard/PostCard'
import { PostCardSkeleton } from '../PostCard/PostCardSkeleton'
import useGtag from '@/hooks/useGtag'

const cx = bindClassNames(styles)

type Props = {
  posts: TrendingPost[]
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
  const { gtag } = useGtag()
  const timeframe = (params.timeframe ?? 'week') as Timeframe
  const hasLoaded = useRef<boolean>(false)
  const hasClicked = useRef<boolean>(false)

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

  function isPost(args: any): args is Post {
    if (!args.is_ad) return true
    return false
  }

  useEffect(() => {
    if (hasLoaded.current) return
    hasLoaded.current = true
    gtag('ads_feed_view')
  }, [gtag])

  const onClick = () => {
    if (hasClicked.current) return
    hasClicked.current = true
    gtag('ads_feed_click')
  }

  if (isLoading) return <PostCardSkeletonGrid forHome={forHome} forPost={forPost} />

  return (
    <ul className={cx('block', 'homeGrid')}>
      {posts.map((post, i) => {
        if (isPost(post)) {
          return (
            <Fragment key={post.id}>
              <PostCard post={post} forHome={forHome} forPost={forPost} onClick={onPostCardClick} />
              {posts.length - 1 === i && !isFeed && (
                <PostCardSkeleton forHome={forHome} forPost={forPost} fetchMore={fetchMore} />
              )}
            </Fragment>
          )
        } else {
          return (
            <AdPostCard
              key={post.id}
              post={post}
              forHome={forHome}
              forPost={forPost}
              onClick={onClick}
            />
          )
        }
      })}
      {isFetching &&
        Array(ENV.defaultPostLimit)
          .fill(0)
          .map((_, index) => <PostCardSkeleton key={index} forHome={forHome} forPost={forPost} />)}
    </ul>
  )
}

export default PostCardGrid
