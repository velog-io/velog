import { PostReadLog } from '@prisma/client'

export interface PostReadLogInterface {
  log(params: LogParams): Promise<PostReadLog>
}

export type LogParams = {
  userId: string
  postId: string
  percentage: number
  resumeTitleId: string | null
}
