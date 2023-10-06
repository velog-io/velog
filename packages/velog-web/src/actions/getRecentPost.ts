import { ENV } from '@/env'
import { RecentPostsDocument, RecentPostsInput } from '@/graphql/generated'
import postData from '@/lib/postData'
import { Posts } from '@/types/post'

export default async function getRecentPost({ limit = ENV.defaultPostLimit }: RecentPostsInput) {
  try {
    const body = {
      operationName: 'recentPosts',
      query: RecentPostsDocument,
      variables: {
        input: {
          limit,
        },
      },
    }

    const TEN_SECOND = 10
    const { recentPosts } = await postData({
      body,
      next: { revalidate: TEN_SECOND },
    })

    return recentPosts as Posts[]
  } catch (error) {
    console.log('getRecentPosts error', error)
    throw new Error('getRecentPosts error')
  }
}
