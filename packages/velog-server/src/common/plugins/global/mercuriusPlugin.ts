import mercurius from 'mercurius'
import { schema, resolvers } from '@graphql/index.js'
import type { FastifyPluginAsync } from 'fastify'
import { GraphQLContext } from '@interfaces/graphql.js'
import { ENV } from '@env'
import { isHttpError } from '@errors/HttpError.js'
import { container } from 'tsyringe'
import { DiscordService } from '@lib/discord/DiscordService.js'

const mercuriusPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.register(mercurius, {
    logLevel: 'error',
    schema,
    resolvers: resolvers,
    graphiql: ENV.appEnv !== 'production',
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
      const result = {
        name,
        message,
        code,
        statusCode,
        stack,
        errors: errors?.map((error) => ({ name: error.name, message: error.message })),
      }
      if (ENV.appEnv === 'development') {
        request.log.error(request, 'errorHandler')
      } else {
        const discord = container.resolve(DiscordService)
        discord.sendMessage(
          'error',
          JSON.stringify({
            requestbody: request?.body,
            result,
          }),
        )
      }
    },
    errorFormatter: (execution, ctx) => {
      const e = execution.errors?.[0]?.originalError

      if (!isHttpError(e)) {
        ;(ctx as any).request?.log?.error(execution, 'errorFormatter')
        const discord = container.resolve(DiscordService)
        discord.sendMessage(
          'error',
          JSON.stringify({
            requestbody: (ctx as any).request?.body,
            execution,
          }),
        )

        return { statusCode: 500, response: execution }
      }

      const errors = execution.errors?.map((error) =>
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

export default mercuriusPlugin
