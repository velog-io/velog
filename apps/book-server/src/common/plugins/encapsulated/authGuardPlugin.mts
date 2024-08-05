import { UnauthorizedError } from '@errors/UnauthorizedError.mjs'
import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'

const authGuardPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('preHandler', async (request) => {
    if (!request.writer) {
      throw new UnauthorizedError('Not logged in')
    }
  })
}

export default fp(authGuardPlugin)
