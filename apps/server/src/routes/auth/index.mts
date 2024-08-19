import v3 from './v3/index.mjs'

import { FastifyPluginCallback } from 'fastify'

const authRoute: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.register(v3, { prefix: '/v3' })
  done()
}

export default authRoute
