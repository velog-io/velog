import { Posts } from '@/types/post'
import styles from './PostCardGrid.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import PostCard from '@/features/post/components/PostCard/PostCard'
import { Suspense, useEffect } from 'react'
import { PostCardSkeleton } from '@/features/post/components/PostCard/PostCardSkeleton'

const cx = bindClassNames(styles)

type Props = {
  data: Posts[]
  forHome: boolean
  forPost: boolean
  loading?: boolean
}

function PostCardGrid({
  data = [],
  forHome = false,
  forPost = false,
  loading = false,
}: Props) {
  return (
    <div className={cx('block')}>
      {data.map((post, i) => {
        if (!post) return null
        return (
          <Suspense
            key={i}
            fallback={<PostCardSkeleton forHome={forHome} forPost={forPost} />}
          >
            <PostCard
              key={post.id}
              post={post}
              forHome={forHome}
              forPost={forPost}
            />
          </Suspense>
        )
      })}
      {loading &&
        Array(8)
          .fill(0)
          .map((_, i) => (
            <PostCardSkeleton key={i} forHome={forHome} forPost={forPost} />
          ))}
    </div>
  )
}

export default PostCardGrid
