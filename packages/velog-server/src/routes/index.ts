import authRoute from '@routes/auth/index.js'
import { FastifyPluginCallback } from 'fastify'

const api: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.register(authRoute, { prefix: '/auth' })

  done()
}

const routes: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.get('/', async (request) => {
    const ip = request.ipaddr
    const user = request.user
    return { user, ip }
  })

  fastify.register(api, {
    prefix: '/api',
  })

  done()
}

export default routes
