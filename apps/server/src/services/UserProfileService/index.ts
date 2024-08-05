import { BadRequestError } from '@errors/BadRequestErrors.js'
import { NotFoundError } from '@errors/NotfoundError.js'
import { UnauthorizedError } from '@errors/UnauthorizedError.js'
import { DbService } from '@lib/db/DbService.js'
import { UtilsService } from '@lib/utils/UtilsService.js'
import { Prisma, UserProfile } from '@packages/database/velog-rds'
import DataLoader from 'dataloader'
import { injectable, singleton } from 'tsyringe'

interface Service {
  userProfileLoader(): DataLoader<string, UserProfile>
  updateUserProfile(
    patch: Prisma.UserProfileUpdateInput,
    signedUserId?: string,
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
    signedUserId?: string,
  ): Promise<UserProfile> {
    if (!signedUserId) {
      throw new UnauthorizedError('Not logged In')
    }

    if (patch.display_name && this.utils.checkEmpty(patch.display_name as string)) {
      throw new BadRequestError('Display name should not be empty')
    }

    if (patch.profile_links) {
      const allowedKeys = ['url', 'email', 'facebook', 'github', 'twitter']
      const valid = Object.keys(patch.profile_links).every((key) => allowedKeys.includes(key))
      if (!valid) {
        throw new BadRequestError('Profile_links contains invalid key')
      }
    }

    const profile = await this.db.userProfile.findUnique({
      where: {
        fk_user_id: signedUserId,
      },
    })

    if (!profile) {
      throw new NotFoundError('Failed to retrieve user profile')
    }

    const updated = await this.db.userProfile.update({
      data: { ...patch },
      where: {
        fk_user_id: signedUserId,
      },
    })

    return updated
  }
}
