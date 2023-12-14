import { FastifySchema } from 'fastify'

export const createUrlSchema: FastifySchema = {
  body: {
    type: 'object',
    required: ['type', 'filename'],
    properties: {
      type: {
        type: 'string',
      },
      refId: {
        type: 'string' || undefined,
      },
      filename: {
        type: 'string',
      },
    },
  },
} as const

export type CreateUrlBody = {
  type: string
  refId?: any
  filename: string
}
