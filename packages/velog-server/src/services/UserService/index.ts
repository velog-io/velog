import { CurrentUser } from '@interfaces/user'
import { CookieService } from '@lib/cookie/CookieService.js'
import { DbService } from '@lib/db/DbService.js'
import { Prisma, User } from '@prisma/client'
import { injectable, singleton } from 'tsyringe'
import { GraphQLContext } from '@interfaces/graphql'
import { JwtService } from '@lib/jwt/JwtService.js'
import { RefreshTokenData } from '@lib/jwt/JwtInterface.js'
import { Time } from '@constants/TimeConstants.js'
import {
  UnauthorizedError,
  NotFoundError,
  BadRequestError,
  ForbiddenError,
  ConfilctError,
} from '@errors/index.js'
import { UserToken } from '@graphql/helpers/generated'
import { UtilsService } from '@lib/utils/UtilsService.js'
import DataLoader from 'dataloader'
import { AuthService } from '@services/AuthService/index.js'
import { FastifyReply } from 'fastify'
import { RedisService } from '@lib/redis/RedisService.js'
import { changeEmailTemplate } from '@template/changeEmailTemplate.js'
import { ENV } from '@env'
import { MailService } from '@lib/mail/MailService.js'
import { ChangeEmailArgs } from '@lib/redis/RedisService.js'
import { differenceInDays } from 'date-fns'

interface Service {
  findById(userId: string): Promise<User | null>
  findByUsername(username: string): Promise<User | null>
  findByIdOrUsername({ userId, username }: FindByIdOrUsernameArgs): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  updateUser(patch: Prisma.UserUpdateInput, signedUserId?: string): Promise<User>
  getCurrentUser(userId: string | undefined): Promise<CurrentUser | null>
  updateLastAccessedAt(userId: string): Promise<void>
  userLoader(): DataLoader<string, User>
  restoreToken(ctx: GraphQLContext): Promise<UserToken>
  verifyEmailAccessPermission(user: User, signedUserId?: string): void
  unregister(reply: FastifyReply, token: string, signedUserId?: string): Promise<void>
  initiateChangeEmail(email: string, signedUserId?: string): Promise<void>
  confirmChangeEmail(code: string, signedUserId?: string): Promise<void>
  checkTrust(userId: string): Promise<boolean>
}

@injectable()
@singleton()
export class UserService implements Service {
  constructor(
    private readonly db: DbService,
    private readonly cookie: CookieService,
    private readonly jwt: JwtService,
    private readonly utils: UtilsService,
    private readonly redis: RedisService,
    private readonly mail: MailService,
    private readonly authService: AuthService,
  ) {}
  public async findById(userId: string): Promise<User | null> {
    return await this.db.user.findUnique({ where: { id: userId } })
  }

  public async findByUsername(username: string): Promise<User | null> {
    return await this.db.user.findUnique({ where: { username } })
  }
  public async findByIdOrUsername({
    userId,
    username,
  }: FindByIdOrUsernameArgs): Promise<User | null> {
    if (!userId && !username) {
      throw new BadRequestError()
    }

    if (username) {
      return await this.findByUsername(username)
    }

    return await this.findById(userId!)
  }

  public async findByEmail(email: string) {
    const validate = this.utils.validateEmail(email)
    if (!validate) {
      throw new BadRequestError('Invalid email format')
    }

    return await this.db.user.findUnique({
      where: {
        email: email,
      },
    })
  }
  public async updateUser(patch: Prisma.UserUpdateInput, signedUserId?: string) {
    if (!signedUserId) {
      throw new UnauthorizedError('Not logged in')
    }

    return await this.db.user.update({
      where: {
        id: signedUserId,
      },
      data: {
        ...patch,
      },
    })
  }

  public async getCurrentUser(userId: string | undefined): Promise<CurrentUser | null> {
    if (!userId) return null
    const user = await this.db.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        profile: true,
        userMeta: true,
      },
    })

    if (!user) return null
    return user
  }

  public async updateLastAccessedAt(userId?: string): Promise<void> {
    if (!userId) return
    try {
      await this.db.userProfile.update({
        where: {
          fk_user_id: userId,
        },
        data: {
          last_accessed_at: this.utils.now,
        },
      })
    } catch (error) {
      console.error('updateLastAccessedAt error', error)
    }
  }
  public async restoreToken(ctx: Pick<GraphQLContext, 'request' | 'reply'>): Promise<UserToken> {
    const refreshToken: string | undefined = ctx.request.cookies['refresh_token']
    if (!refreshToken) {
      throw new UnauthorizedError('Not logged in')
    }

    const decoded = await this.jwt.decodeToken<RefreshTokenData>(refreshToken)
    const user = await this.findById(decoded.user_id)

    if (!user) {
      throw new NotFoundError('Not found user')
    }

    const tokens = await this.jwt.refreshUserToken(
      user!.id,
      decoded.token_id,
      decoded.exp,
      refreshToken,
    )

    this.cookie.setCookie(ctx.reply, 'access_token', tokens.accessToken, {
      maxAge: Time.ONE_DAY_IN_S,
    })
    this.cookie.setCookie(ctx.reply, 'refresh_token', tokens.refreshToken, {
      maxAge: Time.ONE_DAY_IN_S * 30,
    })

    return tokens
  }

  public verifyEmailAccessPermission(user: User, signedUserId?: string) {
    if (user.id !== signedUserId) {
      throw new UnauthorizedError('No permission to read email address')
    }
  }
  public userLoader() {
    return this.createUserLoader()
  }
  private createUserLoader(): DataLoader<string, User> {
    return new DataLoader(async (userIds) => {
      const users = await this.db.user.findMany({
        where: {
          id: {
            in: userIds as string[],
          },
        },
      })
      const nomalized = this.utils.normalize(users, (user) => user.id)
      return userIds.map((userId) => nomalized[userId])
    })
  }

  public async unregister(
    reply: FastifyReply,
    token: string,
    signedUserId?: string,
  ): Promise<void> {
    if (!signedUserId) {
      throw new UnauthorizedError('Not logged in')
    }

    const decoded = await this.jwt.decodeToken<{ user_id: string; sub: string }>(token)

    if (decoded.sub !== 'unregister_token') {
      throw new ForbiddenError('Invalid unregister_token')
    }

    if (decoded.user_id !== signedUserId) {
      throw new ConfilctError('Mismatch user_id')
    }

    const user = await this.findById(signedUserId)

    if (!user) {
      throw new NotFoundError('User not found')
    }

    this.authService.logout(reply)
    try {
      await this.db.user.delete({
        where: {
          id: signedUserId,
        },
      })
    } catch (_) {}
  }

  public async initiateChangeEmail(email: string, signedUserId?: string): Promise<void> {
    if (!signedUserId) {
      throw new UnauthorizedError('Not logged in')
    }

    const validate = this.utils.validateEmail(email)

    if (!validate) {
      throw new BadRequestError('Invalid email format')
    }

    const checkEmailExists = await this.findByEmail(email)

    if (checkEmailExists) {
      throw new ConfilctError('Aleady exists email')
    }

    const user = await this.findById(signedUserId)

    if (!user) {
      throw new NotFoundError('Not found user account')
    }

    const code = this.utils.alphanumeric()
    const key = this.redis.generateKey.changeEmail(code)
    const data = JSON.stringify({
      userId: user.id,
      email: email.toLowerCase(),
    } as ChangeEmailArgs)

    const template = changeEmailTemplate(user.username, email, code)

    try {
      if (ENV.dockerEnv === 'development') {
        console.log(`Login URL: ${ENV.clientV3Host}/email-change?code=${code}`)
      } else {
        await this.mail.sendMail({
          to: email,
          from: 'verify@velog.io',
          ...template,
        })
      }
    } catch (error) {
      console.error('change email error', error)
      throw error
    }

    this.redis.set(key, data, 'EX', Time.ONE_MINUTE_IN_S * 30)
  }
  public async confirmChangeEmail(code: string, signedUserId?: string): Promise<void> {
    if (!signedUserId) {
      throw new UnauthorizedError('Not logged in')
    }

    const key = this.redis.generateKey.changeEmail(code)
    const metadata = await this.redis.get(key)

    if (!metadata) {
      throw new NotFoundError('Not found data')
    }

    const { userId, email }: ChangeEmailArgs = JSON.parse(metadata)

    if (userId !== signedUserId) {
      throw new UnauthorizedError('No permission to change the email')
    }

    const user = await this.findById(userId)

    if (!user) {
      throw new NotFoundError('Not found user')
    }

    await this.updateUser({ email }, signedUserId)
    this.redis.del(key)
  }

  public async checkTrust(userId: string): Promise<boolean> {
    const user = await this.db.user.findUnique({
      where: {
        id: userId,
      },
    })

    if (!user) {
      throw new NotFoundError('Not found user')
    }

    const joinDay = new Date(user.created_at)
    const today = new Date()

    const diffDays = differenceInDays(today, joinDay)
    return diffDays > 20
  }
}

type FindByIdOrUsernameArgs = {
  userId?: string
  username?: string
}
