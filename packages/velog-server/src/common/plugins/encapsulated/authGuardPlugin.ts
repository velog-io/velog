import { UnauthorizedError } from '@errors/UnauthorizedError.js'
import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'

const authGuardPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('preHandler', async (request) => {
    if (!request.user) {
      throw new UnauthorizedError('Not logged in')
    }
  })
}

export default fp(authGuardPlugin)
