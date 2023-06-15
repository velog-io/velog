import { Post } from '@prisma/client'
import { injectable } from 'tsyringe'

interface Service {
  getPostsByTag(params: GetPostsByTagParams): Promise<Post>
}

@injectable()
export class PostsTagsService implements Service {
  public async getPostsByTag({
    tagName,
    cursor,
    limit = 20,
    userId,
    userself,
  }: GetPostsByTagParams): Promise<Post> {}
}

type GetPostsByTagParams = {
  tagName: string
  cursor?: string
  limit?: number
  userId?: string
  userself: boolean
}
