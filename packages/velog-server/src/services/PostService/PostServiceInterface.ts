import {
  ReadingListInput,
  RecentPostsInput,
  TrendingPostsInput,
} from '@graphql/generated'
import { Post } from '@prisma/client'

export interface PostServiceInterface {
  getReadingList(
    input: ReadingListInput,
    userId: string | undefined
  ): Promise<Post[]>
  //  getPostsByRead(input: GetPostsByTypeParams): Promise<Post[]>
  // getPostsByLiked(input: GetPostsByTypeParams): Promise<Post[]>
  getRecentPosts(
    input: RecentPostsInput,
    userId: string | undefined
  ): Promise<Post[]>
  getTrendingPosts(
    input: TrendingPostsInput,
    ip: string | null
  ): Promise<Post[]>
}

// export abstract class PostServiceBase {
//   abstract getReadingList(
//     input: ReadingListInput,
//     userId: string | undefined
//   ): Promise<Post[]>
//   protected abstract getPostsByLiked(
//     input: GetPostsByTypeParams
//   ): Promise<Post[]>
//   protected abstract getPostsByRead(
//     input: GetPostsByTypeParams
//   ): Promise<Post[]>
// }

export type GetPostsByTypeParams = {
  cursor: string | undefined
  userId: string
  limit: number
}
