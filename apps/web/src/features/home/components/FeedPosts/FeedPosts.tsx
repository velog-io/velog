'use client'

import { Post } from '@/graphql/server/generated/server'
import PostCardGrid from '../PostCardGrid'
import useFeedPosts from '../../hooks/useFeedPosts'
import FeedPostsEmpty from './FeedPostsEmpty'

type Props = {
  data: Post[]
}

function FeedPosts({ data }: Props) {
  const { posts, isFetching, fetchMore, isLoading } = useFeedPosts(data)

  if (data.length === 0 && posts.length === 0) return <FeedPostsEmpty />
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
