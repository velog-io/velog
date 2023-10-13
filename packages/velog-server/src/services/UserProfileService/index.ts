import { UnauthorizedError } from '@errors/UnauthorizedError'
import { DbService } from '@lib/db/DbService'
import { UtilsService } from '@lib/utils/UtilsService'
import { UserProfile } from '@prisma/client'
import DataLoader from 'dataloader'
import { injectable, singleton } from 'tsyringe'

interface Service {
  getProfile(userId?: string): Promise<UserProfile>
}

@injectable()
@singleton()
export class UserProfileService implements Service {
  constructor(
    private readonly db: DbService,
    private readonly utils: UtilsService,
  ) {}
  public async getProfile(userId?: string): Promise<UserProfile> {
    if (!userId) {
      throw new UnauthorizedError('Not logged in')
    }
    const profileLoader = this.createUserProfileLoader()
    return profileLoader.load(userId)
  }
  private createUserProfileLoader(): DataLoader<string, any> {
    return new DataLoader(async (userIds: readonly string[]) => {
      const profiles = await this.db.userProfile.findMany({
        where: {
          fk_user_id: {
            in: userIds as string[],
          },
        },
      })
      const nomalized = this.utils.normalize(profiles, (profile) => profile.fk_user_id!)
      const ordered = userIds.map((id) => nomalized[id])
      return ordered
    })
  }
}
