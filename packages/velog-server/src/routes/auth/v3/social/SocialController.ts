import { HttpStatus } from '@constants/HttpStatusConstants.js'
import { HttpStatusMessage } from '@constants/HttpStatusMesageConstants.js'
import { Time } from '@constants/TimeConstants.js'
import { ENV } from '@env'
import { CookieService } from '@lib/cookie/CookieService.js'
import { DbService } from '@lib/db/DbService.js'
import { JwtService } from '@lib/jwt/JwtService.js'
import {
  GetProfileFromSocial,
  SocialProvider,
} from '@services/SocialService/SocialServiceInterface'
import { SocialService } from '@services/SocialService/index.js'
import { FastifyReply, FastifyRequest } from 'fastify'
import { injectable, singleton } from 'tsyringe'

interface Controller {
  facebookCallback(
    request: FastifyRequest<{ Querystring: { code: string } }>,
    reply: FastifyReply,
  ): Promise<void>
  githubCallback(
    request: FastifyRequest<{ Querystring: { code: string } }>,
    reply: FastifyReply,
  ): Promise<void>
  socialCallback(
    request: FastifyRequest<{ Querystring: { state?: string; next?: string } }>,
    reply: FastifyReply,
  ): Promise<void>
  socialRegister(
    request: FastifyRequest<{
      Body: { display_name: string; username: string; short_bio: string }
    }>,
    reply: FastifyReply,
  ): Promise<void>
}

@singleton()
@injectable()
export class SocialController implements Controller {
  constructor(
    private readonly socialService: SocialService,
    private readonly db: DbService,
    private readonly jwt: JwtService,
    private readonly cookie: CookieService,
  ) {}
  async facebookCallback(
    request: FastifyRequest<{ Querystring: { code: string } }>,
    reply: FastifyReply,
  ): Promise<void> {
    const { code } = request.query

    if (!code) {
      reply.status(HttpStatus.BAD_REQUEST).send('Code is required')
      return
    }
    const profile = await this.socialService.getSocialDataFromFacebook(code)
    request.socialProfile = profile
  }
  async githubCallback(
    request: FastifyRequest<{ Querystring: { code: string } }>,
    reply: FastifyReply,
  ): Promise<void> {
    const { code } = request.query

    if (!code) {
      reply.status(HttpStatus.BAD_REQUEST).send('Code is required')
      return
    }

    const profile = await this.socialService.getSocialDataFromGithub(code)
    request.socialProfile = profile
  }
  async googleCallback(
    request: FastifyRequest<{ Querystring: { code: string } }>,
    reply: FastifyReply,
  ): Promise<void> {
    const { code } = request.query

    if (!code) {
      reply.status(HttpStatus.BAD_REQUEST).send('Code is required')
      return
    }
    const profile = await this.socialService.getSocialDataFromGoogle(code)
    request.socialProfile = profile
  }
  async socialCallback(
    request: FastifyRequest<{ Querystring: { state?: string; next?: string } }>,
    reply: FastifyReply,
  ): Promise<void> {
    if (!request.socialProfile) {
      reply.status(HttpStatus.NOT_FOUND).send('Social profile data is missing')
      return
    }

    const { profile, socialAccount, accessToken, provider } = request.socialProfile

    if (!profile || !accessToken) return

    if (socialAccount) {
      const user = await this.db.user.findUnique({
        where: {
          id: socialAccount.fk_user_id!,
        },
      })

      if (!user) {
        throw new Error('User is missing')
      }

      const tokens = await this.jwt.generateUserToken(user.id)
      this.cookie.setCookie(reply, 'access_token', tokens.accessToken, {
        maxAge: Time.ONE_HOUR_IN_MS,
      })
      this.cookie.setCookie(reply, 'refresh_token', tokens.refreshToken, {
        maxAge: Time.ONE_DAY_IN_MS * 30,
      })

      const redirectUrl = ENV.clientHost
      const state = request.query.state
        ? (JSON.parse(request.query.state) as { next: string; integrateState?: string })
        : null
      const next = request.query.next || state?.next || '/'

      // if (next.includes('user-integrate') && state) {
      //   const isIntegrated = await externalInterationService.checkIntegrated(user.id)
      //   if (isIntegrated) {
      //     const code = await externalInterationService.createIntegrationCode(user.id)
      //     ctx.redirect(`${process.env.CODENARY_CALLBACK}?code=${code}&state=${state.integrateState}`)
      //     return
      //   }
      // }

      reply.redirect(decodeURI(redirectUrl.concat(next)))
    }
  }
  async socialRegister(
    request: FastifyRequest<{
      Body: { display_name: string; username: string; short_bio: string }
    }>,
    reply: FastifyReply,
  ) {
    // check token existancy
    const registerToken = this.cookie.getCookie(reply, 'register_token')
    if (!registerToken) {
      reply.status(HttpStatus.UNAUTHORIZED).send(HttpStatusMessage.UNAUTHORIZED)
      return
    }

    const { display_name, username, short_bio } = request.body
    let decoded: SocialRegisterToken | null = null
    try {
      decoded = await this.jwt.decodeToken<SocialRegisterToken>(registerToken)
    } catch (e) {
      // failed to decode token
      reply.status(HttpStatus.UNAUTHORIZED).send(HttpStatusMessage.UNAUTHORIZED)
      return
    }

    const email = decoded.profile.email

    try {
      const exists = await this.db.user.findFirst({
        where: {
          OR: [
            { username: username },
            {
              email: {
                equals: email,
                not: null,
              },
            },
          ],
        },
      })

      if (exists) {
        reply.status(HttpStatus.CONFLICT).send('ALREADY_EXISTS')
        return
      }

      const user = await this.db.user.create({
        data: {
          username,
          email,
          is_certified: true,
          profile: {
            create: {
              display_name,
              short_bio,
            },
          },
          socialAccount: {
            create: {
              access_token: decoded.accessToken,
              provider: decoded.provider,
              social_id: decoded.profile.uid.toString(),
            },
          },
          velogConfig: {
            create: {},
          },
          userMeta: {
            create: {},
          },
        },
      })
    } catch (error) {}
  }
}

type SocialRegisterToken = {
  profile: GetProfileFromSocial
  provider: SocialProvider
  accessToken: string
}
