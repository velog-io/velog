export const PutPostScoreSchema = {
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

export type PutPostScoreOptions = {
  Params: {
    postId: string
  }
}
