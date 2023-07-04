import {
  ReadPostInput,
  ReadingListInput,
  RecentPostsInput,
  TrendingPostsInput,
} from '@graphql/generated'
import { Post, Prisma } from '@prisma/client'

export interface PostServiceInterface {
  getReadingList(input: ReadingListInput, userId: string | undefined): Promise<Post[]>
  // private getPostsByRead(input: GetPostsByTypeParams): Promise<Post[]>
  // private getPostsByLiked(input: GetPostsByTypeParams): Promise<Post[]>
  getRecentPosts(input: RecentPostsInput, userId: string | undefined): Promise<Post[]>
  getTrendingPosts(input: TrendingPostsInput, ip: string | null): Promise<Post[]>
  getPost(input: ReadPostInput, userId: string | undefined): Promise<Post | null>
}

export type GetPostsByTypeParams = {
  cursor: string | undefined
  userId: string
  limit: number
}

export type PostWith = Prisma.PostGetPayload<{
  include: {
    user?: true
    Comment?: true
    Feed?: true
    PostCategory?: true
    PostHistory?: true
    PostImage?: true
    PostLike?: true
    PostRead?: true
    PostReadLog?: true
    PostScore?: true
    PostTagLegacy?: true
    SeriesPost?: true
    UrlSlugHistory?: true
    postTags?: true
  }
}>
