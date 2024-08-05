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
  additionalProperties: false,
})

export type CreateUrlBody = FromSchema<typeof createUrlBodySchema>

export const uploadBodySchema = asConst({
  type: 'object',
  required: ['type'],
  properties: {
    type: {
      type: 'string',
      enum: ['post', 'profile'],
    },
    ref_id: {
      type: 'string',
    },
  },
  additionalProperties: false,
})

export type UploadBody = FromSchema<typeof uploadBodySchema>
