import { ENV } from '@env'
import { FastifyPluginAsync } from 'fastify'

const errorHandlerPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.setErrorHandler((error, _, reply) => {
    if (ENV.appEnv === 'development') {
      console.log('fastify error:', error)
    }
    if (error?.statusCode) {
      reply.status(error.statusCode)
    } else {
      reply.status(500)
    }
    reply.send({
      message: error.message || 'Unknown Error',
      name: error.name || 'Error',
      stack: ENV.appEnv === 'development' ? error.stack : undefined,
    })
  })
}

export default errorHandlerPlugin
