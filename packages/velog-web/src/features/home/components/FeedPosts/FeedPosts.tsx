'use client'

import { Post } from '@/graphql/generated'
import PostCardGrid from '../PostCardGrid'
import { useEffect, useState } from 'react'
import useFeedPosts from '../../hooks/useFeedPosts'

type Props = {
  data: Post[]
}

function FeedPosts({ data }: Props) {
  const [initialData, setInitialData] = useState<Post[]>([])
  const { posts, isFetching, fetchMore, isLoading } = useFeedPosts(initialData)

  useEffect(() => {
    setInitialData(data)
  }, [data])

  return (
    <PostCardGrid
      posts={posts}
      forHome={true}
      forPost={false}
      isFetching={isFetching}
      isLoading={isLoading}
      fetchMore={fetchMore}
    />
  )
}

export default FeedPosts
