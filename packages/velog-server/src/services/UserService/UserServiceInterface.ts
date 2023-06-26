import { CurrentUser } from '@interfaces/user'
import { User } from '@prisma/client'

export interface UserServiceInterface {
  findById(userId: string): Promise<User | null>
  findByUsername(username: string): Promise<User | null>
  getCurrentUser(userId: string | undefined): Promise<CurrentUser | null>
}
