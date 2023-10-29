import { DbService } from '@lib/db/DbService.js'
import { User } from '@prisma/client'
import { injectable, singleton } from 'tsyringe'

interface Service {
  findById(userId: string): Promise<User | null>
}

@injectable()
@singleton()
export class UserService implements Service {
  constructor(private readonly db: DbService) {}
  async findById(userId: string): Promise<User | null> {
    const user = await this.db.user.findUnique({
      where: {
        id: userId,
      },
    })
    return user
  }
}
