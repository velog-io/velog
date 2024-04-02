import { DbService } from '@lib/db/DbService.js'
import { MailService } from '@lib/mail/MailService.js'
import { injectable, singleton } from 'tsyringe'
import { nanoid } from 'nanoid'
import { createAuthTemplate } from '@template/createAuthTemplate.js'
import { ENV } from 'src/env.mjs'
import { FastifyReply } from 'fastify'
import { CookieService } from '@lib/cookie/CookieService.js'
import { GraphQLContext } from '@interfaces/graphql.js'
import { UnauthorizedError } from '@errors/UnauthorizedError.js'

interface Service {
  logout(reply: FastifyReply): Promise<void>
  sendMail(email: string): Promise<{ registered: boolean }>
  isAuthenticated(ctx: GraphQLContext): void
}

@injectable()
@singleton()
export class AuthService implements Service {
  constructor(
    private readonly db: DbService,
    private readonly mail: MailService,
    private readonly cookie: CookieService,
  ) {}
  async logout(reply: FastifyReply): Promise<void> {
    this.cookie.clearCookie(reply, 'access_token')
    this.cookie.clearCookie(reply, 'refresh_token')
  }
  async sendMail(email: string): Promise<{ registered: boolean }> {
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

    const template = createAuthTemplate(!!user, emailAuth.code!)

    if (ENV.appEnv === 'development') {
      console.log(
        `Login URL: ${ENV.clientV2Host}/${user ? 'email-login' : 'register'}?code=${
          emailAuth.code
        }`,
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
  public isAuthenticated(ctx: GraphQLContext) {
    if (!ctx.user) {
      throw new UnauthorizedError('Not logged in')
    }
  }
}
