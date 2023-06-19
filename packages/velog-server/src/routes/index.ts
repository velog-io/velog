import { FastifyPluginAsync } from 'fastify'

const indexRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', async (request) => {
    const ip = request.ipaddr
    const user = request.user
    return { user, ip }
  })
}

export default indexRoute
