import { RecentPostsDocument, RecentPostsInput } from '@/graphql/generated'
import postData from '@/lib/postData'
import { Posts } from '@/types/post'

export default async function getRecentPost({
  cursor,
  limit,
}: RecentPostsInput) {
  try {
    const body = {
      operationName: 'recentPosts',
      query: RecentPostsDocument,
      variables: {
        input: {
          cursor,
          limit,
        },
      },
    }

    const { recentPosts } = await postData({
      body,
    })

    return recentPosts as Posts[]
  } catch (error) {
    console.log('getRecentPosts error', error)
    return []
  }
}
