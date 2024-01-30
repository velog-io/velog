import { ENV } from '@env'
import { isHttpError } from '@errors/HttpError.js'
import { FastifyPluginCallback } from 'fastify'

const errorHandlerPlugin: FastifyPluginCallback = (fastify, _, done) => {
  fastify.addHook('preHandler', function (request, reply, done) {
    if (request.body) {
      request.log.info({ body: request.body }, 'parsed body')
    }
    done()
  })
  fastify.addHook('onError', (request, reply, error) => {
    request.log.error(error, 'fastify onError')
  })
  fastify.setErrorHandler((error, request, reply) => {
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
      request.log.error(error, 'fastify handleError')
    }
  })

  done()
}

export default errorHandlerPlugin
