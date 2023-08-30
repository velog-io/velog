import { format } from 'date-fns'
import { FastifyPluginCallback } from 'fastify'
import post from '@routes/posts/index.js'
import { HttpStatusMessage } from '@constants/HttpStatusMessageConstants.js'

const api: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.register(post, { prefix: '/posts' })

  fastify.get('/ping', async (_, reply) => {
    const serverCurrentTime = format(new Date(), 'yyyy-MM-dd:HH:mm:ss')
    reply.status(200).send({ serverCurrentTime })
  })
  done()
}

const routes: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.get('/', (_, reply) => {
    reply.status(200).send(HttpStatusMessage.Ok)
  })

  fastify.register(api, {
    prefix: '/api',
  })

  done()
}

export default routes
