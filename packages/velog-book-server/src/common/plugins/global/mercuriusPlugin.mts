import mercurius from 'mercurius'
import { schema, resolvers } from '@graphql/index.mjs'
import type { FastifyPluginAsync } from 'fastify'
import { GraphQLContext } from '@interfaces/graphql.mjs'
import { isHttpError } from '@errors/HttpError.mjs'
import { container } from 'tsyringe'
import { DiscordService } from '@lib/discord/DiscordService.mjs'
import { EnvService } from '@lib/env/EnvService.mjs'

const mercuriusPlugin: FastifyPluginAsync = async (fastify) => {
  const env = container.resolve(EnvService)

  fastify.register(mercurius, {
    logLevel: 'error',
    schema,
    resolvers: resolvers,
    graphiql: env.get('appEnv') !== 'production',
    context: (request, reply): GraphQLContext => {
      return {
        request,
        reply,
        ip: request.ipaddr,
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
      if (env.get('appEnv') === 'development') {
        console.log('errorHandler')
        request.log.error(request, 'errorHandler')
      } else {
        const discord = container.resolve(DiscordService)
        discord.sendMessage(
          'error',
          JSON.stringify({
            type: 'errorHandler',
            requestbody: request?.body,
            result,
          }),
        )
      }
    },
    errorFormatter: (execution, ctx) => {
      const e = execution.errors?.[0]?.originalError

      if (!isHttpError(e)) {
        console.log('send!')
        ;(ctx as any).request?.log?.error(execution, 'errorFormatter')
        const discord = container.resolve(DiscordService)
        discord.sendMessage(
          'error',
          JSON.stringify({
            type: 'errorFormat',
            requestbody: (ctx as any).request?.body,
            execution,
            user: (ctx as any).request?.user,
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
