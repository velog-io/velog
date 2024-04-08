import type { FastifyRequest, FastifyReply } from 'fastify'
import { PubSub } from 'mercurius'

export type GraphQLContext = GraphQLContextBase & {
  pubsub: PubSub
}

export type GraphQLContextBase = {
  request: FastifyRequest
  reply: FastifyReply
  ip: string | null
}
