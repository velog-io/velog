import { DbService } from '@lib/db/DbService'
import { FastifyReply, FastifyRequest } from 'fastify'

export class AuthController {
  constructor(private readonly db: DbService) {}
  async sendMail(request: FastifyRequest<{ Body: SendMailBody }>, reply: FastifyReply) {
    const { email } = request.body
  }
}

type SendMailBody = {
  email: string
}
