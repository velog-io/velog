import { format } from 'date-fns'
import { FastifyPluginAsync } from 'fastify'
import post from '@routes/posts/index.js'

const routes: FastifyPluginAsync = async (fastify) => {
  fastify.register(post, { prefix: '/posts' })

  fastify.get('/ping', async (request) => {
    const serverCurrentTime = format(new Date(), 'yyyy-MM-dd:HH:mm:ss')
    return { serverCurrentTime }
  })
}

export default routes
