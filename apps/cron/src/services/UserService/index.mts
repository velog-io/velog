import { DbService } from '@lib/db/DbService.mjs'
import { User } from '@packages/database/velog-rds'
import { injectable, singleton } from 'tsyringe'

interface Service {
  findByUserId(userId: string): Promise<User | null>
}

@injectable()
@singleton()
export class UserService implements Service {
  constructor(private readonly db: DbService) {}
  async findByUserId(userId: string): Promise<User | null> {
    const user = await this.db.user.findUnique({
      where: {
        id: userId,
      },
    })
    return user
  }
}
