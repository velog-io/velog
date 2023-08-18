import { FastifyPluginAsync, FastifyPluginCallback } from 'fastify'

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
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    })
    if (process.env.NODE_ENV === 'development') {
      console.log(error)
    }
  })

  done()
}

export default errorHandlerPlugin
