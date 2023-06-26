import mercurius from 'mercurius'
import { schema, resolvers } from '@graphql/index.js'
import type { FastifyPluginAsync } from 'fastify'
import { GraphQLContext } from '@interfaces/graphql.js'
import { ENV } from 'src/env.js'
import { isHttpError } from '@errors/HttpError.js'

const mercuriusPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.register(mercurius, {
    schema,
    resolvers: resolvers,
    graphiql: ENV.appEnv === 'development',
    context: (request, reply): GraphQLContext => {
      return {
        request,
        reply,
        ip: request.ipaddr,
        user: request.user,
      }
    },
    errorFormatter: (result) => {
      console.log(result)
      const e = result.errors?.[0]?.originalError

      if (isHttpError(e)) {
        const errors = result.errors?.map((error) =>
          Object.assign(error, {
            extensions: {
              name: e.name,
              description: e.description,
            },
          })
        )
        return {
          statusCode: e.statusCode,
          response: {
            errors,
          },
        }
      }
      return { statusCode: 400, response: result }
    },
  })
}

export default mercuriusPlugin
