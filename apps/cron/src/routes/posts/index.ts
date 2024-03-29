import { FastifyPluginCallback } from 'fastify'
import v1 from './v1/index.js'

const postRoute: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.register(v1, { prefix: '/v1' })
  done()
}

export default postRoute
