import { User, UserProfile } from '@prisma/client'

export type CurrentUser = User & {
  profile: UserProfile
}
