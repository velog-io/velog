import { ENV } from '@/env'
import FeedPosts from '@/features/home/components/FeedPosts'

import getFeedPosts from '@/prefetch/getFeedPosts'

export default async function FeedHome() {
  const posts = await getFeedPosts({ limit: ENV.defaultPostLimit })

  return <FeedPosts data={posts} />
}
