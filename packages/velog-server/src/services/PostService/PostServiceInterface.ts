import { Comment, Post, User } from '@prisma/client'

export type PostIncludeUser = Post & { user?: User }
export type PostIncludeComment = Post & { comments?: Comment[] }

export type GetPostsByTypeParams = {
  cursor: string | undefined
  userId: string
  limit: number
}

export type Timeframe = 'day' | 'week' | 'month' | 'year'
