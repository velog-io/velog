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
    errorHandler(error, request) {
      console.log('url', request.url)
      console.log('graphql error', error)
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
