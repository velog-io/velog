import { FromSchema, asConst } from 'json-schema-to-ts'

export const uploadBodySchema = asConst({
  type: 'object',
  required: ['bookUrlSlug', 'type'],
  properties: {
    ref_id: {
      type: 'string',
    },
    type: {
      type: 'string',
      enum: ['book'],
    },
    bookUrlSlug: {
      type: 'string',
    },
  },
  additionalProperties: false,
})

export type UploadBody = FromSchema<typeof uploadBodySchema>
