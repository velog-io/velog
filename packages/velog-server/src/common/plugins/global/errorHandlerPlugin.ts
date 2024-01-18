import { ENV } from '@env'
import { isHttpError } from '@errors/HttpError.js'
import { FastifyPluginCallback } from 'fastify'

const errorHandlerPlugin: FastifyPluginCallback = (fastify, _, done) => {
  fastify.addHook('onError', (request, reply, error) => {
    console.log('request', request)
    console.log('fastify hook error:', error)
  })
  fastify.setErrorHandler((error, _, reply) => {
    if (isHttpError(error)) {
      reply.status(error.statusCode).send({
        message: error.message,
        name: error.name,
        stack: ENV.appEnv === 'development' ? error.stack : undefined,
      })
    } else {
      reply.status(500).send({
        message: error.message || 'Internal Server Error',
        name: error.name || 'Error',
        stack: ENV.appEnv === 'development' ? error.stack : undefined,
      })
    }

    if (ENV.appEnv === 'development') {
      console.error(error)
    }
  })

  done()
}

export default errorHandlerPlugin
