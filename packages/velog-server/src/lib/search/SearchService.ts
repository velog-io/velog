import { DbService } from '@lib/db/DbService'
import { injectable, singleton } from 'tsyringe'

interface Service {}

@injectable()
@singleton()
export class SearchService implements Service {
  constructor(private readonly db: DbService) {}
  public async searchSync() {
    return {
      update: async (postId: string) => await this.searchSyncUpdate(postId),
    }
  }
  private async searchSyncUpdate(postId: string) {
    const post = await this.db.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    })

    if (!post) return
  }
}
