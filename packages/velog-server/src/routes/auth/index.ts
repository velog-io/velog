import auth from './v3'

import { FastifyPluginCallback } from 'fastify'

const authRoute: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.register(auth, { prefix: '/v3' })
  done()
}

export default authRoute
