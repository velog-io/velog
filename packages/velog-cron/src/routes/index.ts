import { format } from 'date-fns'
import { FastifyPluginCallback } from 'fastify'
import post from '@routes/posts/index.js'

const routes: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.register(post, { prefix: '/posts' })

  fastify.get('/ping', async (request, reply) => {
    const serverCurrentTime = format(new Date(), 'yyyy-MM-dd:HH:mm:ss')
    reply.status(200).send({ serverCurrentTime })
  })

  done()
}

export default routes
