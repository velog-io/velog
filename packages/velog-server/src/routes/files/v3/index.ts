import { FastifyPluginCallback } from 'fastify'
import { createUrlBodySchema } from './schema.js'
import { FromSchema } from 'json-schema-to-ts'
import { FilesController } from './filesController.js'
import { container } from 'tsyringe'

const v3: FastifyPluginCallback = (fastify, opts, done) => {
  const controller = container.resolve(FilesController)

  fastify.post<{ Body: FromSchema<typeof createUrlBodySchema> }>(
    '/create-url',
    {
      schema: {
        body: createUrlBodySchema,
      },
    },
    async (request, reply) => {
      try {
        return await controller.createUrl({
          body: request.body,
          ip: request.ip,
          ipaddr: request.ipaddr,
          signedUserId: request.user?.id,
        })
      } catch (error: any) {
        if (error.name === 'ContentTypeError') {
          reply.status(400).send('BAD_REQUEST')
          return
        }
        reply.status(500).send('INTERNAL_SERVER_ERROR')
        return
      }
    },
  )
  done()
}

export default v3
