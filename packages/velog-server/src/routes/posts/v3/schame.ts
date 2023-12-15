export const PostScoreSchema = {
  params: {
    type: 'object',
    required: ['postId'],
    properties: {
      postId: {
        type: 'string',
      },
    },
  },
} as const

export type PostScoreParams = {
  Params: {
    postId: string
  }
}
