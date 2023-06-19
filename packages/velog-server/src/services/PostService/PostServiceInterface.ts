import { ReadingListInput } from '@graphql/generated'
import { Post } from '@prisma/client'

export interface PostServiceInterface {
  getReadingList(
    input: ReadingListInput,
    userId: string | undefined
  ): Promise<Post[]>
  // private getPostsByRead(input: GetPostsByTypeParams): Promise<Post[]>
  // private getPostsByLiked(input: GetPostsByTypeParams): Promise<Post[]>
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
