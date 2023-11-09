import { NotFoundError } from '@errors/NotfoundError.js'
import { UnauthorizedError } from '@errors/UnauthorizedError.js'
import { DbService } from '@lib/db/DbService.js'
import { UtilsService } from '@lib/utils/UtilsService.js'
import { Prisma, UserProfile } from '@prisma/client'
import DataLoader from 'dataloader'
import { injectable, singleton } from 'tsyringe'

interface Service {
  userProfileLoader(): DataLoader<string, UserProfile>
  updateUserProfile(
    patch: Prisma.UserProfileUpdateInput,
    loggedUserId?: string,
  ): Promise<UserProfile>
}

@injectable()
@singleton()
export class UserProfileService implements Service {
  constructor(
    private readonly db: DbService,
    private readonly utils: UtilsService,
  ) {}
  public userProfileLoader() {
    return this.createUserProfileLoader()
  }
  private createUserProfileLoader(): DataLoader<string, UserProfile> {
    return new DataLoader(async (userIds) => {
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
  async updateUserProfile(
    patch: Prisma.UserProfileUpdateInput,
    loggedUserId?: string,
  ): Promise<UserProfile> {
    if (!loggedUserId) {
      throw new UnauthorizedError('Not logged In')
    }

    const profile = await this.db.userProfile.findUnique({
      where: {
        fk_user_id: loggedUserId,
      },
    })

    if (!profile) {
      throw new NotFoundError('Failed to retrieve user profile')
    }

    const updated = await this.db.userProfile.update({
      data: { ...patch },
      where: {
        fk_user_id: loggedUserId,
      },
    })

    return updated
  }
}
