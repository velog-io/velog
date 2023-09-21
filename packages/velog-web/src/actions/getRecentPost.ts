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

    const TWO_MINUTE = 60 * 1
    const { recentPosts } = await postData({
      body,
      next: { revalidate: TWO_MINUTE },
    })

    return recentPosts as Posts[]
  } catch (error) {
    console.log('getRecentPosts error', error)
    return []
  }
}
