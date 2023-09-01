import { HttpStatus } from '@constants/HttpStatusConstants.js'
import { HttpStatusMessage } from '@constants/HttpStatusMesageConstants.js'
import { Time } from '@constants/TimeConstants.js'
import { ENV } from '@env'
import { B2ManagerService } from '@lib/b2Manager/B2ManagerService.js'
import { CookieService } from '@lib/cookie/CookieService.js'
import { DbService } from '@lib/db/DbService.js'
import { FileService } from '@lib/file/FileService.js'
import { JwtService } from '@lib/jwt/JwtService.js'
import { User } from '@prisma/client'
import {
  GetProfileFromSocial,
  SocialProvider,
} from '@services/SocialService/SocialServiceInterface.js'
import { SocialService } from '@services/SocialService/index.js'
import { ExternalIntegrationService } from '@services/ExternalIntegrationService/index.js'
import { FastifyReply, FastifyRequest } from 'fastify'
import { injectable, singleton } from 'tsyringe'
import { google } from 'googleapis'

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
  getSocialProfile(request: FastifyRequest, reply: FastifyReply): Promise<void>
}

@singleton()
@injectable()
export class SocialController implements Controller {
  constructor(
    private readonly socialService: SocialService,
    private readonly db: DbService,
    private readonly jwt: JwtService,
    private readonly cookie: CookieService,
    private readonly file: FileService,
    private readonly b2Manager: B2ManagerService,
    private readonly externalInterationService: ExternalIntegrationService,
  ) {}
  private get redirectUri(): string {
    return `${ENV.apiHost}/api/v2/auth/social/callback`
  }
  public async facebookCallback(
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
  public async githubCallback(
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
  public async googleCallback(
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
  public async socialCallback(
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

      if (next.includes('user-integrate') && state) {
        const isIntegrated = await this.externalInterationService.checkIntegrated(user.id)
        if (isIntegrated) {
          const code = await this.externalInterationService.createIntegrationCode(user.id)
          reply.redirect(
            `${process.env.CODENARY_CALLBACK}?code=${code}&state=${state.integrateState}`,
          )
          return
        }
      }

      reply.redirect(decodeURI(redirectUrl.concat(next)))
    }
  }
  public async socialRegister(
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

      if (decoded?.profile.thumbnail) {
        try {
          const imageUrl = await this.syncProfileImageWithB2(decoded.profile.thumbnail, user)

          await this.db.userProfile.update({
            where: {
              fk_user_id: user.id,
            },
            data: {
              thumbnail: imageUrl,
            },
          })
        } catch (e) {
          console.log(e)
        }
      }

      const tokens = await this.jwt.generateUserToken(user.id)
      this.cookie.setCookie(reply, 'access_token', tokens.accessToken, {
        maxAge: Time.ONE_HOUR_IN_MS,
      })
      this.cookie.setCookie(reply, 'refresh_token', tokens.refreshToken, {
        maxAge: Time.ONE_DAY_IN_MS * 30,
      })

      const profile = await this.db.userProfile.findFirst({
        where: {
          fk_user_id: user.id,
        },
      })

      const result = {
        ...user,
        profile,
        tokens: {
          access_token: tokens.accessToken,
          refresh_token: tokens.refreshToken,
        },
      }

      reply.status(HttpStatus.OK).send(result)
    } catch (error) {
      console.log(error)
    }
  }
  private async syncProfileImageWithB2(url: string, user: User): Promise<string> {
    const result = await this.file.downloadFile(url)

    const filename = `social_profile.${result.extension}`

    //convert readstream to buffer
    const buffer = await new Promise<Buffer>((resolve, reject) => {
      const buffers: Buffer[] = []
      result.stream.on('data', (data: Buffer) => buffers.push(data))
      result.stream.on('end', () => resolve(Buffer.concat(buffers)))
      result.stream.on('error', reject)
    })

    const filesize = buffer.length
    const userImage = await this.db.userImage.create({
      data: {
        fk_user_id: user.id,
        type: 'profile',
        filesize,
      },
    })

    const uploadPath = this.file
      .generateUploadPath({
        id: userImage.id,
        type: 'profile',
        username: user.username,
      })
      .concat(`/${filename}`)

    const uploadResult = await this.b2Manager.upload(buffer, uploadPath)

    return uploadResult.url
  }
  public async getSocialProfile(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const registerToken = this.cookie.getCookie(reply, 'register_token')
    if (!registerToken) {
      reply.status(HttpStatus.UNAUTHORIZED).send(HttpStatusMessage.UNAUTHORIZED)
      return
    }

    try {
      const decoded = await this.jwt.decodeToken<SocialRegisterToken>(registerToken)
      reply.status(HttpStatus.OK).send(decoded.profile)
    } catch (e) {
      reply.status(HttpStatus.BAD_REQUEST).send(HttpStatusMessage.BAD_REQUEST)
    }
  }
  public async socialRedirect(
    request: FastifyRequest<{
      Params: { provider: SocialProvider }
      Querystring: { next: string; isIntegrate: string; integrateState: string }
    }>,
    reply: FastifyReply,
  ) {
    const { next, isIntegrate, integrateState } = request.query
    const { provider } = request.params
    const loginUrl = this.generateSocialLoginLink(provider, {
      isIntegrate: isIntegrate === '1',
      next,
      integrateState,
    })
    reply.redirect(loginUrl)
  }
  private generateSocialLoginLink(
    provider: SocialProvider,
    { next = '/', isIntegrate = false, integrateState }: Options,
  ) {
    const generator = this.socialLoginLiknGenerator[provider]
    return generator({
      next: encodeURI(next),
      isIntegrate,
      integrateState,
    })
  }
  private get socialLoginLiknGenerator() {
    return {
      github: ({ next, isIntegrate, integrateState }: Options) => {
        const redirectUriWithOptions = `${this.redirectUri}/github?next=${next}&isIntegrate=${
          isIntegrate ? 1 : 0
        }&integrateState=${integrateState ?? ''}`
        return `https://github.com/login/oauth/authorize?scope=user:email&client_id=${ENV.githubClientId}&redirect_uri=${redirectUriWithOptions}`
      },
      facebook: ({ next, isIntegrate, integrateState }: Options) => {
        const state = JSON.stringify({ next, isIntegrate: isIntegrate ? 1 : 0, integrateState })
        const callbackUri = `${this.redirectUri}/facebook`
        return `https://www.facebook.com/v4.0/dialog/oauth?client_id=${ENV.facebookClientId}&redirect_uri=${callbackUri}&state=${state}&scope=email,public_profile`
      },
      google: ({ next, isIntegrate, integrateState }: Options) => {
        const callback = `${this.redirectUri}/google`
        const oauth2Client = new google.auth.OAuth2(ENV.googleClientId, ENV.googleSecret, callback)
        const url = oauth2Client.generateAuthUrl({
          scope: [
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile',
          ],
          state: JSON.stringify({ next, isIntegrate: isIntegrate ? 1 : 0, integrateState }),
        })
        return url
      },
    }
  }
}

type SocialRegisterToken = {
  profile: GetProfileFromSocial
  provider: SocialProvider
  accessToken: string
}

type Options = {
  next: string
  isIntegrate?: boolean
  integrateState?: string
}
