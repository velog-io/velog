import { DbService } from '@lib/db/dbService.js'
import { User } from '@prisma/client'
import { injectable } from 'tsyringe'

interface Service {
  findById(userId: string): Promise<User | null>
  findByUsername(username: string): Promise<User | null>
}

@injectable()
export class UserService implements Service {
  constructor(private readonly db: DbService) {}
  async findById(userId: string): Promise<User | null> {
    return await this.db.user.findUnique({ where: { id: userId } })
  }
  async findByUsername(username: string): Promise<User | null> {
    return await this.db.user.findFirst({ where: { username } })
  }
}
