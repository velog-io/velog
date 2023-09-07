import { BadRequestError } from '@errors/BadRequestErrors.js'
import { ConfilctError } from '@errors/ConfilctError.js'
import { NotFoundError } from '@errors/NotfoundError.js'
import { UnauthorizedError } from '@errors/UnauthorizedError.js'
import { DbService } from '@lib/db/DbService.js'
import { injectable, singleton } from 'tsyringe'

interface Service {
  follow(userId: string, followUserId: string): Promise<void>
  unfllow(userId: string, followUserId: string): Promise<void>
}

@injectable()
@singleton()
export class FollowService implements Service {
  constructor(private readonly db: DbService) {}
  async follow(userId?: string, followUserId?: string): Promise<void> {
    if (!followUserId) {
      throw new BadRequestError('followUesrId is required')
    }

    if (!userId) {
      throw new UnauthorizedError('Not Logged In')
    }

    const follower = await this.db.user.findUnique({
      where: {
        id: followUserId,
      },
    })

    if (!follower) {
      throw new NotFoundError('Not found follower User')
    }

    const existingFollower = await this.db.followUser.findFirst({
      where: {
        fk_user_id: userId,
        fk_follow_user_id: followUserId,
      },
    })

    if (existingFollower) {
      throw new ConfilctError('ALREADY_FOLLOWER')
    }

    await this.db.followUser.create({
      data: {
        fk_user_id: userId,
        fk_follow_user_id: followUserId,
      },
    })
  }
  async unfllow(userId: string, followUserId: string): Promise<void> {
    if (!followUserId) {
      throw new BadRequestError('followUesrId is required')
    }

    if (!userId) {
      throw new UnauthorizedError('Not Logged In')
    }
    const follower = await this.db.user.findUnique({
      where: {
        id: followUserId,
      },
    })

    if (!follower) {
      throw new NotFoundError('Not found follower User')
    }

    const follow = await this.db.followUser.findFirst({
      where: {
        fk_user_id: userId,
        fk_follow_user_id: followUserId,
      },
    })

    if (!follow) {
      throw new NotFoundError('Not found relationship')
    }

    await this.db.followUser.delete({
      where: {
        id: follow.id,
      },
    })
  }
}
