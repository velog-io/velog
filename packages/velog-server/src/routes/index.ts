import authRoute from '@routes/auth/index.js'
import postsRoute from '@routes/posts/index.js'
import { format } from 'date-fns'
import { FastifyPluginCallback } from 'fastify'

const api: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.register(authRoute, { prefix: '/auth' })
  fastify.register(postsRoute, { prefix: '/posts' })

  fastify.get('/ping', (request, reply) => {
    const now = new Date()
    const serverTime = format(now, 'yyyy-MM-dd HH:mm:ss')
    reply.send({ serverTime })
  })
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
