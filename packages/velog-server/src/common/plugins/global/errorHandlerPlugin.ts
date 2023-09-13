import { FastifyPluginAsync } from 'fastify'

const errorHandlerPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.setErrorHandler((error, _, reply) => {
    console.log('error', error)
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
}

export default errorHandlerPlugin
