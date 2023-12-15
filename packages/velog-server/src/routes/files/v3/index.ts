import { FastifyPluginCallback } from 'fastify'
import { createUrlBodySchema } from './schema.js'
import { FromSchema } from 'json-schema-to-ts'

const v3: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.post<{ Body: FromSchema<typeof createUrlBodySchema> }>(
    '/create-url',
    {
      schema: {
        body: createUrlBodySchema,
      },
    },
    async (request, reply) => {
      console.log(request.body)
      reply.status(201).send({ message: 'hello' })
    },
  )
  done()
}

export default v3
