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

export const uploadBodySchema = asConst({
  type: 'object',
  required: ['type'],
  properties: {
    type: {
      type: 'string',
    },
    ref_id: {
      type: 'string',
    },
  },
})

export type UploadBody = FromSchema<typeof uploadBodySchema>
