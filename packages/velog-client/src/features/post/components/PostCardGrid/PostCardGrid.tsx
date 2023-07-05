import { PartialPost } from '@/types/post'
import styles from './PostCardGrid.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import PostCard from '@/features/post/components/PostCard/PostCard'
import { Suspense } from 'react'
import { PostCardSkeleton } from '@/features/post/components/PostCard/PostCardSkeleton'

const cx = bindClassNames(styles)

type Props = {
  posts: (PartialPost | undefined)[]
  loading?: boolean
  forHome: boolean
  forPost: boolean
}

function PostCardGrid({
  posts,
  loading,
  forHome = false,
  forPost = false,
}: Props) {
  return (
    <div className={cx('block')}>
      {posts.map((post, i) => {
        if (!post) return null
        return (
          <Suspense
            key={post.id}
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
    </div>
  )
}

export default PostCardGrid
