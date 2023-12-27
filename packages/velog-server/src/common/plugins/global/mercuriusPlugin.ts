import mercurius from 'mercurius'
import { schema, resolvers } from '@graphql/index.js'
import type { FastifyPluginAsync } from 'fastify'
import { GraphQLContext } from '@interfaces/graphql.js'
import { ENV } from '@env'
import { isHttpError } from '@errors/HttpError.js'

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
    errorHandler(error) {
      const { name, message, code, stack, errors, statusCode } = error
      const result = {
        name,
        message,
        code,
        statusCode,
        stack,
        errors: errors?.map((error) => ({ name: error.name, message: error.message })),
      }
      console.log('----errorHandler----\n', result)
    },
    errorFormatter: (execution, ctx) => {
      console.log('errorFormatter execution:', execution)
      console.log('body', (ctx as any).request?.body)
      const e = execution.errors?.[0]?.originalError

      if (!isHttpError(e)) {
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
