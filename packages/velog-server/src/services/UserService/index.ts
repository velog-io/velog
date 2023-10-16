import { CurrentUser } from '@interfaces/user'
import { CookieService } from '@lib/cookie/CookieService.js'
import { DbService } from '@lib/db/DbService.js'
import { User } from '@prisma/client'
import { injectable, singleton } from 'tsyringe'
import { GraphQLContext } from '@interfaces/graphql'
import { JwtService } from '@lib/jwt/JwtService.js'
import { RefreshTokenData } from '@lib/jwt/Jwt.interface.js'
import { Time } from '@constants/TimeConstants.js'
import { UnauthorizedError, NotFoundError } from '@errors/index.js'
import { UserToken } from '@graphql/generated'
import { UtilsService } from '@lib/utils/UtilsService.js'
import DataLoader from 'dataloader'

interface Service {
  findById(userId: string): Promise<User | null>
  findByUsername(username: string): Promise<User | null>
  getCurrentUser(userId: string | undefined): Promise<CurrentUser | null>
  restoreToken(ctx: GraphQLContext): Promise<UserToken>
  emailGuard(user: User, loggedUserId: string | undefined): void
  userLoader(): DataLoader<string, User>
}

@injectable()
@singleton()
export class UserService implements Service {
  constructor(
    private readonly db: DbService,
    private readonly cookie: CookieService,
    private readonly jwt: JwtService,
    private readonly utils: UtilsService,
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

    await this.db.userProfile.update({
      where: {
        fk_user_id: user.id,
      },
      data: {
        last_accessed_at: this.utils.now,
      },
    })

    return user
  }
  async restoreToken(ctx: Pick<GraphQLContext, 'request' | 'reply'>): Promise<UserToken> {
    const refreshToken: string | undefined = ctx.request.cookies['refresh_token']
    if (!refreshToken) {
      throw new UnauthorizedError('Not Logged In')
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
      maxAge: Time.ONE_HOUR_IN_MS,
    })
    this.cookie.setCookie(ctx.reply, 'refresh_token', tokens.refreshToken, {
      maxAge: Time.ONE_DAY_IN_MS * 30,
    })

    return tokens
  }
  public emailGuard(user: User, loggedUserId: string | undefined) {
    if (user.id !== loggedUserId) {
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
}
