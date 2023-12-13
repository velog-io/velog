import { ENV } from '@/env'
import FeedPosts from '@/features/home/components/FeedPosts'

import getFeedPosts from '@/prefetch/getFeedPosts'
import { cookies } from 'next/headers'

export default async function FeedHome() {
  const token = cookies().get('access_token') || cookies().get('refresh_token')
  const posts = await getFeedPosts({ limit: ENV.defaultPostLimit, accessToken: token?.value })

  return <FeedPosts data={posts} />
}
