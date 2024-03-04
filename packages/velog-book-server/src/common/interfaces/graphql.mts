import type { FastifyRequest, FastifyReply } from 'fastify'

export type GraphQLContext = {
  request: FastifyRequest
  reply: FastifyReply
  ip: string | null
}
