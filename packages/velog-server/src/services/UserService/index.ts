import { CurrentUser } from '@interfaces/user'
import { CookieService } from '@lib/cookie/CookieService.js'
import { DbService } from '@lib/db/DbService.js'
import { User } from '@prisma/client'
import { UserServiceInterface } from './UserServiceInterface'
import { FastifyReply } from 'fastify/types/reply'
import { injectable } from 'tsyringe'
import { JwtService } from '@lib/jwt/JwtService.js'

@injectable()
export class UserService implements UserServiceInterface {
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
  async logout(reply: FastifyReply): Promise<void> {
    this.cookie.clearCookie(reply, 'access_token')
    this.cookie.clearCookie(reply, 'refresh_token')
  }
}
