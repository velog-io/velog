import { asConst } from 'json-schema-to-ts'

export const postScoreParamsSchema = asConst({
  type: 'object',
  required: ['postId'],
  properties: {
    postId: {
      type: 'string',
    },
  },
  additionalProperties: false,
})

export type PostScoreParams = {
  Params: {
    postId: string
  }
}
