import { FastifyPluginCallback } from 'fastify'

const v1: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.put('/score', (request, reply) => {
    reply.send('/score')
  })

  done()
}

export default v1
