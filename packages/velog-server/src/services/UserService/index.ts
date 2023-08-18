import { CurrentUser } from '@interfaces/user'
import { CookieService } from '@lib/cookie/CookieService.js'
import { DbService } from '@lib/db/DbService.js'
import { User } from '@prisma/client'
import { FastifyReply } from 'fastify/types/reply'
import { injectable } from 'tsyringe'
import { GraphQLContext } from '@interfaces/graphql'
import { JwtService } from '@lib/jwt/JwtService.js'
import { RefreshTokenData } from '@lib/jwt/Jwt.interface.js'
import { Time } from '@constants/TimeConstants.js'
import { UnauthorizedError, NotFoundError } from '@errors/index.js'
import { UserToken } from '@graphql/generated'

interface Service {
  findById(userId: string): Promise<User | null>
  findByUsername(username: string): Promise<User | null>
  getCurrentUser(userId: string | undefined): Promise<CurrentUser | null>
  restoreToken(ctx: GraphQLContext): Promise<UserToken>
  logout(reply: FastifyReply, userId: string | undefined): Promise<void>
}

@injectable()
export class UserService implements Service {
  constructor(
    private readonly db: DbService,
    private readonly cookie: CookieService,
    private readonly jwt: JwtService
  ) {}
  async findById(userId: string): Promise<User | null> {
    return await this.db.user.findUnique({ where: { id: userId } })
  }
  async findByUsername(username: string): Promise<User | null> {
    return await this.db.user.findFirst({ where: { username } })
  }
  async getCurrentUser(userId: string | undefined): Promise<CurrentUser | null> {
    if (!userId) return null
    const user = await this.db.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        profile: true,
      },
    })
    if (!user) return null

    return user
  }
  async restoreToken(ctx: Pick<GraphQLContext, 'request' | 'reply'>): Promise<UserToken> {
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
      refreshToken
    )

    this.cookie.setCookie(ctx.reply, 'access_token', tokens.accessToken, {
      maxAge: Time.ONE_HOUR_IN_MS,
    })
    this.cookie.setCookie(ctx.reply, 'refresh_token', tokens.refreshToken, {
      maxAge: Time.ONE_DAY_IN_MS * 30,
    })

    return tokens
  }
  async logout(reply: FastifyReply): Promise<void> {
    this.cookie.clearCookie(reply, 'access_token')
    this.cookie.clearCookie(reply, 'refresh_token')
  }
}
