import socialRoute from '@routes/auth/v3/social'
import { FastifyPluginCallback } from 'fastify'

const auth: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.register(socialRoute, { prefix: '/social' })
  done()
}

export default auth
