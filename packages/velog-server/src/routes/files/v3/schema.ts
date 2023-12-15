import { asConst } from 'json-schema-to-ts'

export const createUrlBodySchema = asConst({
  type: 'object',
  required: ['type', 'filename'],
  properties: {
    type: {
      type: 'string',
    },
    refId: {
      type: 'string',
    },
    filename: {
      type: 'string',
    },
  },
  additionalProperties: false,
})

export type CreateUrlBody = {
  type: string
  refId?: any
  filename: string
}
