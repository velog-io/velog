import { FromSchema, asConst } from 'json-schema-to-ts'

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
    payload: true,
  },
})

export type CreateUrlBody = FromSchema<typeof createUrlBodySchema>
