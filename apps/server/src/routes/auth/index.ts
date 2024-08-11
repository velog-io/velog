import v3 from './v3/index.js'

import { FastifyPluginCallback } from 'fastify'

const authRoute: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.register(v3, { prefix: '/v3' })
  done()
}

export default authRoute
