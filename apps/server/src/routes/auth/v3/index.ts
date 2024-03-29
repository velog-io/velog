import socialRoute from '@routes/auth/v3/social/index.js'
import { FastifyPluginCallback } from 'fastify'

const v3: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.register(socialRoute, { prefix: '/social' })

  done()
}

export default v3
