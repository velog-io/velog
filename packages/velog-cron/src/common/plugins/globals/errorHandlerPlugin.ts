import { ENV } from '@env'
import { FastifyPluginCallback } from 'fastify'

const errorHandlerPlugin: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.setErrorHandler((error, _, reply) => {
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
    if (ENV.appEnv === 'development') {
      console.log(error)
    }
  })

  done()
}

export default errorHandlerPlugin
