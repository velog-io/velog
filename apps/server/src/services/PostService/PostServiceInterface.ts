import { Comment, Post, Tag, User } from '@packages/database/src/velog-rds/index.mjs'

export type PostIncludeUser = Post & { user?: User }
export type PostIncludeComment = Post & { comments?: Comment[] }
export type PostIncludeTags = Post & { tags?: Tag[] }

export type GetPostsByTypeParams = {
  cursor: string | undefined
  userId: string
  limit: number
}

export type Timeframe = 'day' | 'week' | 'month' | 'year'
