import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'

const authPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.decorateRequest('user', null)
  fastify.addHook('preHandler', async (request) => {
    if (request.url.includes('/auth/logout')) return
  })
}

export default fp(authPlugin)
