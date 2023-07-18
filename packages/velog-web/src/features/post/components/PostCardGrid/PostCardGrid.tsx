'use client'

import { Posts } from '@/types/post'
import styles from './PostCardGrid.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import PostCard from '@/features/post/components/PostCard/PostCard'
import { PostCardSkeleton } from '@/features/post/components/PostCard/PostCardSkeleton'

const cx = bindClassNames(styles)

type Props = {
  posts: Posts[]
  forHome: boolean
  forPost: boolean
  loading?: boolean
}

function PostCardGrid({
  posts = [],
  forHome = false,
  forPost = false,
  loading = false,
}: Props) {
  return (
    <div className={cx('block')}>
      {posts.map((post, i) => {
        return (
          <PostCard
            key={`${post}-${i}`}
            post={post}
            forHome={forHome}
            forPost={forPost}
          />
        )
      })}
      {loading &&
        Array(Number(process.env.NEXT_PUBLIC_DEFAULT_POST_LIMIT) ?? 24)
          .fill(0)
          .map((_, i) => (
            <PostCardSkeleton key={i} forHome={forHome} forPost={forPost} />
          ))}
    </div>
  )
}

export default PostCardGrid
