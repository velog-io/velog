import { ENV } from '@env'
import { isHttpError } from '@errors/HttpError.mjs'
import { DiscordService } from '@lib/discord/DiscordService.mjs'
import { FastifyPluginCallback } from 'fastify'
import { container } from 'tsyringe'
import fp from 'fastify-plugin'

const errorHandlerPlugin: FastifyPluginCallback = (fastify, _, done) => {
  fastify.addHook('preHandler', function (request, reply, done) {
    if (request.body) {
      request.log.info({ body: request.body }, 'parsed body')
    }
    done()
  })
  fastify.addHook('onError', (request, reply, error, done) => {
    request.log.error(error, 'fastify onError')
    const discord = container.resolve(DiscordService)
    discord
      .sendMessage(
        'error',
        JSON.stringify({
          type: 'fastify OnError',
          body: request?.body,
          query: request?.query,
          error,
          writer: request?.writer,
          ip: request?.ip,
        }),
      )
      .catch(console.error)

    done()
  })
  fastify.setErrorHandler((error, request, reply) => {
    console.log('!! error', error)
    if (isHttpError(error)) {
      console.log('isHttpError', error)
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
    } else {
      const discord = container.resolve(DiscordService)
      discord
        .sendMessage(
          'error',
          JSON.stringify({
            type: 'fastify handleError',
            body: request?.body,
            query: request?.query,
            error,
            writer: request?.writer,
            ip: request?.ip,
          }),
        )
        .catch(console.error)
    }
  })

  done()
}

export default fp(errorHandlerPlugin)
