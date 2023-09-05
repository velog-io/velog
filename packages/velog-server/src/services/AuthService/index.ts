import { DbService } from '@lib/db/DbService'
import { MailService } from '@lib/mail/MailService'
import { FastifyReply, FastifyRequest } from 'fastify'
import { injectable, singleton } from 'tsyringe'
import { nanoid } from 'nanoid'
import { createAuthEmail } from '@template/createAuthEmail'
import { ENV } from '@env'
import { SendMailInput } from '@graphql/generated'

interface Service {
  sendMail(input: SendMailInput): Promise<{ registered: boolean }>
}

@injectable()
@singleton()
export class AuthService implements Service {
  constructor(
    private readonly db: DbService,
    private readonly mail: MailService,
  ) {}
  async sendMail(input: SendMailInput): Promise<{ registered: boolean }> {
    const { email } = input
    const user = await this.db.user.findUnique({
      where: {
        email,
      },
    })

    const emailAuth = await this.db.emailAuth.create({
      data: {
        code: nanoid(),
        email: email.toLowerCase(),
      },
    })

    const template = createAuthEmail(!!user, emailAuth.code!)

    if (ENV.appEnv === 'development') {
      console.log(
        `Login URL: ${ENV.clientHost}/${user ? 'email-login' : 'register'}?code=${emailAuth.code}`,
      )
    } else {
      await this.mail.sendMail({
        to: email,
        from: 'verify@velog.io',
        ...template,
      })
    }

    return { registered: !!user }
  }
}

type SendMailBody = {
  email: string
}
