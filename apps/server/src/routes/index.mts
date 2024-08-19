import authRoute from '@routes/auth/index.mjs'
import postsRoute from '@routes/posts/index.mjs'
import filesRoute from '@routes/files/index.mjs'
import { format } from 'date-fns'
import type { FastifyPluginCallback } from 'fastify'

const api: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.register(authRoute, { prefix: '/auth' })
  fastify.register(postsRoute, { prefix: '/posts' })
  fastify.register(filesRoute, { prefix: '/files' })

  fastify.get('/ping', (request, reply) => {
    const now = new Date()
    const serverTime = format(now, 'yyyy-MM-dd HH:mm:ss')
    reply.send({ serverTime })
  })

  fastify.get('/check', (_, reply) => {
    reply.status(200).send({ version: 'v3' })
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
