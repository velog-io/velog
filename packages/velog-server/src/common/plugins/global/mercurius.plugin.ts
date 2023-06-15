import mercurius from 'mercurius'
import { schema, resolvers } from '@graphql/index.js'
import type { FastifyPluginAsync } from 'fastify'
import { GraphQLContext } from '@common/interfaces/graphql'
import { ENV } from 'src/env'

const mercuriusPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.register(mercurius, {
    schema,
    resolvers: resolvers,
    graphiql: ENV.appEnv === 'development',
    context: async (request, reply): Promise<GraphQLContext> => {
      return {
        request,
        reply,
        ip: request.ipaddr,
        user: request.user,
      }
    },
  })
}

export default mercuriusPlugin
