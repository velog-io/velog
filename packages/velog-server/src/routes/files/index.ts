import { FastifyPluginCallback } from 'fastify'
import v3 from './v3/index.js'

const filesRoute: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.register(v3, { prefix: '/v3' })
  done()
}

export default filesRoute
