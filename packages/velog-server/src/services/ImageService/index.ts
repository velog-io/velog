import { DbService } from '@lib/db/DbService'
import { UserImageNext } from '@prisma/client'
import { injectable, singleton } from 'tsyringe'

interface Service {}

@injectable()
@singleton()
export class ImageService implements Service {
  constructor(private readonly db: DbService) {}
  async getImagesOf(postId: string) {
    const images = await this.db.userImageNext.findMany({
      where: {
        ref_id: postId,
      },
    })
    return images
  }
  async untrackPastImages(userId: string) {
    const images = await this.db.userImageNext.findMany({
      where: {
        type: 'profile',
        tracked: true,
        fk_user_id: userId,
      },
      orderBy: {
        created_at: 'desc',
      },
    })

    if (images.length < 2) return
    // remove first one

    const promises = images.slice(1).map(async (image) => {
      this.db.userImageNext.update({
        where: {
          id: image.id,
        },
        data: {
          tracked: false,
        },
      })
    })

    await Promise.all(promises)
  }

  async trackImages(images: UserImageNext[], body: string) {
    const promises = images.map(async (image) => {
      const tracked = body.includes(image.id) ? true : false
      return await this.db.userImageNext.update({
        where: {
          id: image.id,
        },
        data: {
          ...image,
          tracked,
        },
      })
    })

    return await Promise.all(promises)
  }
}
