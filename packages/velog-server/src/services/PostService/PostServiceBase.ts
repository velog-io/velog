import { ReadingListInput } from '@graphql/generated'
import { Post } from '@prisma/client'

export abstract class PostServiceBase {
  abstract getReadingList(
    input: ReadingListInput,
    userId: string | undefined
  ): Promise<Post[]>
  protected abstract getPostsByLiked(
    input: GetPostsByTypeParams
  ): Promise<Post[]>
  protected abstract getPostsByRead(
    input: GetPostsByTypeParams
  ): Promise<Post[]>
}

export type GetPostsByTypeParams = {
  cursor: string | undefined
  userId: string
  limit: number
}
