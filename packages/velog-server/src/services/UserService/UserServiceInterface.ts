import { UserToken } from '@graphql/generated'
import { GraphQLContext } from '@interfaces/graphql'
import { CurrentUser } from '@interfaces/user'
import { User } from '@prisma/client'
import { FastifyReply } from 'fastify/types/reply'

export interface UserServiceInterface {
  findById(userId: string): Promise<User | null>
  findByUsername(username: string): Promise<User | null>
  getCurrentUser(userId: string | undefined): Promise<CurrentUser | null>
  restoreToken(ctx: GraphQLContext): Promise<UserToken>
  logout(reply: FastifyReply, userId: string | undefined): Promise<void>
}
