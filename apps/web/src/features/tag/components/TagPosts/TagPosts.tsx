'use client'

import PostCardGrid from '@/features/home/components/PostCardGrid/PostCardGrid'
import useTagPosts from '@/features/tag/hooks/useTagPosts'
import { Post } from '@/graphql/server/generated/server'
import styles from './TagPosts.module.css'

type Props = {
  tag: string
  initialData: Post[]
  postsCount: number
}

function TagPosts({ tag, initialData, postsCount }: Props) {
  const { posts, isFetching, fetchMore, isLoading } = useTagPosts({
    tag,
    initialData,
  })

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.count}>총 {postsCount.toLocaleString()}개의 포스트</h1>
      </div>
      <PostCardGrid
        posts={posts}
        forHome={true}
        forPost={false}
        isFetching={isFetching}
        isLoading={isLoading}
        fetchMore={fetchMore}
      />
    </div>
  )
}

export default TagPosts
