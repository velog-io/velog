import mercurius from 'mercurius'
import { schema, resolvers } from '@graphql/index.js'
import type { FastifyPluginAsync } from 'fastify'
import { GraphQLContext } from '@interfaces/graphql.js'
import { ENV } from '@env'
import { isHttpError } from '@errors/HttpError.js'

const mercuriusPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.register(mercurius, {
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
    errorHandler(error, request, reply) {
      console.log('graphql error', error)
      if (!isHttpError(error)) {
        reply.status(400).send({ statusCode: 400, response: error })
      }

      const result = {
        statusCode: error.statusCode || 500,
        response: {
          error,
        },
      }

      const message = ENV.appEnv === 'development' ? error.message : 'INTERNAL SERVER ERROR'
      reply.status(result.statusCode).send(message)
    },
    errorFormatter: (result) => {
      const e = result.errors?.[0]?.originalError
      if (!isHttpError(e)) {
        return { statusCode: 400, response: result }
      }

      const errors = result.errors?.map((error) =>
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
