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
}

export type PostScoreParams = {
  Params: {
    postId: string
  }
}
