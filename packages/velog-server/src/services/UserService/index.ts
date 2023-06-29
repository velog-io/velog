import { CurrentUser } from '@interfaces/user'
import { DbService } from '@lib/db/DbService.js'
import { User } from '@prisma/client'
import { UserServiceInterface } from '@services/UserService/UserServiceInterface'
import { injectable } from 'tsyringe'

@injectable()
export class UserService implements UserServiceInterface {
  constructor(private readonly db: DbService) {}
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
        userProfile: true,
      },
    })

    if (!user) return null

    const { userProfile, ...rest } = user

    return {
      profile: userProfile!,
      ...rest,
    }
  }
}
