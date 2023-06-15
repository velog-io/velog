import { DbService } from '@lib/db/dbService.js'
import { User } from '@prisma/client'
import { injectable } from 'tsyringe'

@injectable()
export class UserService {
  constructor(private readonly db: DbService) {}
  async findById(userId: string): Promise<User | null> {
    return await this.db.user.findUnique({ where: { id: userId } })
  }
}
