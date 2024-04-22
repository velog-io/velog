import fp from 'fastify-plugin'
import mercurius from 'mercurius'
import { schema, resolvers } from '@graphql/index.mjs'
import type { FastifyPluginAsync } from 'fastify'
import { isHttpError } from '@errors/HttpError.mjs'
import { container } from 'tsyringe'
import { DiscordService } from '@lib/discord/DiscordService.mjs'
import { MqService } from '@lib/mq/MqService.mjs'
import { GraphQLContextBase } from '@interfaces/graphql.mjs'
import { ENV } from '@env'
import { schemaTransforms } from '@graphql/transformer/index.mjs'

const mercuriusPlugin: FastifyPluginAsync = async (fastify) => {
  const mqService = container.resolve(MqService)

  fastify.register(mercurius, {
    logLevel: 'error',
    schema,
    resolvers: resolvers,
    graphiql: ENV.appEnv !== 'production',
    subscription: {
      emitter: mqService.emitter,
      verifyClient: (info, next) => {
        // if (info.req.headers['x-fastify-header'] !== 'fastify is awesome !') {
        //   return next(false) // the connection is not allowed
        // }

        next(false)
        // next(true) // the connection is allowed
      },
    },
    context: (request, reply): GraphQLContextBase => {
      return {
        request,
        reply,
        ip: request.ipaddr,
        writer: request.writer,
      }
    },
    schemaTransforms,
    errorHandler: (error, request) => {
      const { name, message, code, stack, errors, statusCode } = error
      const result = {
        name,
        message,
        code,
        statusCode,
        stack,
        errors: errors?.map((error) => ({
          name: error.name,
          message: error.message,
        })),
      }
      if (ENV.appEnv === 'development') {
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
            ip: request?.ip,
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
            ip: (ctx as any).request?.ip,
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

export default fp(mercuriusPlugin)
