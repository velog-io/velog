import mercurius from 'mercurius'
import { schema, resolvers } from '@graphql/index.js'
import type { FastifyPluginAsync } from 'fastify'
import { GraphQLContext } from '@interfaces/graphql.js'
import { ENV } from '@env'
import { isHttpError } from '@errors/HttpError.js'
import { container } from 'tsyringe'
import { DiscordService } from '@lib/discord/DiscordService.js'
import fp from 'fastify-plugin'

const mercuriusPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.register(mercurius, {
    logLevel: 'error',
    schema,
    resolvers: resolvers,
    graphiql: ENV.dockerEnv !== 'production',
    context: (request, reply): GraphQLContext => {
      return {
        request,
        reply,
        ip: request.ipaddr,
        user: request.user,
      }
    },
    errorHandler: (error, request) => {
      const { name, message, code, stack, errors, statusCode } = error
      const errorData = {
        name,
        message,
        code,
        statusCode,
        stack,
        errors: errors?.map((error) => ({ name: error.name, message: error.message })),
      }
      if (ENV.appEnv === 'development') {
        console.log('errorHandler')
        request.log.error(request, 'errorHandler')
      } else {
        const discord = container.resolve(DiscordService)

        discord
          .sendMessage('error', {
            type: 'errorHandler',
            body: request?.body,
            user: request?.user,
            ip: request?.ip,
            originError: error,
            error: errorData,
          })
          .catch(console.error)
      }
    },
    errorFormatter: (error, ctx) => {
      const e = error.errors?.[0]?.originalError

      if (!isHttpError(e)) {
        console.log('mecurius errorFormatter')
        ;(ctx as any).request?.log?.error(error, 'errorFormatter')
        const discord = container.resolve(DiscordService)
        discord
          .sendMessage('error', {
            type: 'errorFormat',
            body: (ctx as any).request?.body,
            error,
            user: (ctx as any).request?.user,
            ip: (ctx as any).request?.ip,
          })
          .catch(console.error)

        return { statusCode: 500, response: error }
      }

      const errors = error.errors?.map((error) =>
        Object.assign(error, {
          extensions: {
            name: e.name,
            message: e.message,
          },
        }),
      )

      return {
        statusCode: e.statusCode,
        response: {
          errors,
        },
      }
    },
  })
}

export default fp(mercuriusPlugin)
