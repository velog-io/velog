import { CurrentUser } from '@common/interfaces/user'
import { FastifyReply, FastifyRequest } from 'fastify'

export type GraphQLContext = {
  request: FastifyRequest
  reply: FastifyReply
  user: CurrentUser | null
  ip: string | null
}
