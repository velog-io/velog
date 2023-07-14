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
      {posts.map((post) => {
        return (
          <PostCard
            key={post.id}
            post={post}
            forHome={forHome}
            forPost={forPost}
          />
        )
      })}
      {loading &&
        Array(12)
          .fill(0)
          .map((_, i) => (
            <PostCardSkeleton key={i} forHome={forHome} forPost={forPost} />
          ))}
    </div>
  )
}

export default PostCardGrid
