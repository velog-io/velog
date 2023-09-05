import { DbService } from '@lib/db/DbService'
import { FastifyReply, FastifyRequest } from 'fastify'
import { nanoid } from 'nanoid'

export class AuthController {
  constructor(private readonly db: DbService) {}
  async sendMail(request: FastifyRequest<{ Body: SendMailBody }>, reply: FastifyReply) {
    const { email } = request.body

    const user = await this.db.user.findUnique({
      where: {
        email,
      },
    })

    const emailAuth = this.db.emailAuth.create({
      data: {
        code: nanoid(),
        email: email.toLowerCase(),
      },
    })
  }
}

type SendMailBody = {
  email: string
}
