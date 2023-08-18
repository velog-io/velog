import { DbService } from '@lib/db/DbService.js'
import { FastifyPluginCallback } from 'fastify'
import { container } from 'tsyringe'

const v1: FastifyPluginCallback = (fastify, opts, done) => {
  const db = container.resolve(DbService)

  fastify.put('/score', (request, reply) => {
    reply.send('/score')
  })

  done()
}

export default v1
