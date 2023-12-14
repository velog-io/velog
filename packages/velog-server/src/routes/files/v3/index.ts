import { FastifyPluginCallback, FastifyRequest } from 'fastify'
import { createUrlSchema } from './schema.js'

const v3: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.post(
    '/create-url',
    {
      schema: createUrlSchema,
    },
    async (
      request: FastifyRequest<{
        Body: {
          type: string
          refId?: any
          filename: string
        }
      }>,
      reply,
    ) => {
      reply.status(201).send({ message: 'hello' })
    },
  )
  done()
}

export default v3
