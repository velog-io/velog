import { BadRequestError } from '@errors/BadRequestErrors.js'
import { NotFoundError } from '@errors/NotfoundError.js'
import { DbService } from '@lib/db/DbService.js'
import { PostService } from '@services/PostService/index.js'
import { container, injectable, singleton } from 'tsyringe'
import { utcToZonedTime } from 'date-fns-tz'
import { startOfDay, subMonths } from 'date-fns'
import { ENV } from '@env'
import fs from 'fs'
import path from 'path'
import { UtilsService } from '@lib/utils/UtilsService.js'

interface Controller {
  updatePostScore(postId: string): Promise<void>
  calculateRecentPostScore(): Promise<number>
}

@singleton()
@injectable()
export class PostController implements Controller {
  constructor(private readonly db: DbService, private readonly postService: PostService) {}
  async updatePostScore(postId: string): Promise<void> {
    const post = await this.postService.findById(postId)

    if (!post) {
      throw new NotFoundError('Not found Post')
    }

    await this.postService.scoreCalculator(post.id)
  }
  async calculateRecentPostScore(): Promise<number> {
    if (ENV.appEnv !== 'development') {
      throw new BadRequestError('This operation is only allowed in development environment.')
    }

    const utcTime = new Date()
    const timezone = 'Asia/Seoul'
    const tz = utcToZonedTime(utcTime, timezone)
    const startOfToday = startOfDay(tz)
    const threeMonthsAgo = subMonths(startOfToday, 3)

    const posts = await this.db.post.findMany({
      where: {
        is_private: false,
        likes: {
          gte: 1,
        },
        released_at: {
          gte: threeMonthsAgo,
        },
      },
      select: {
        id: true,
      },
    })

    for (let i = 0; i < posts.length; i++) {
      console.log(`${i} / ${posts.length}`)
      const postId = posts[i].id
      await this.postService.scoreCalculator(postId)
    }

    return posts.length
  }
  async spamFilterTestRunner() {
    if (ENV.appEnv !== 'development') return

    const utils = container.resolve(UtilsService)
    const postService = container.resolve(PostService)
    try {
      const filePath = path.resolve(utils.resolveDir('./src/routes/posts/v1/spam_post.json'))

      const fileExits = fs.existsSync(filePath)
      if (!fileExits) {
        throw new NotFoundError('Not found spam_post.json')
      }

      const readFileResult = fs.readFileSync(filePath, { encoding: 'utf-8' })
      const data = JSON.parse(readFileResult)
      const key = Object.keys(data)[0]
      const posts: PostData[] = data[key]
        .filter((post: any) => post.title)
        .map((post: any, index: number) => ({ id: index, ...post }))

      const maxPostLength = 5000
      const set = new Set()
      const bannedUesrnames: string[] = []

      for (const post of posts.slice(0, maxPostLength)) {
        const { id, title, body, username } = post
        if (bannedUesrnames.includes(username)) {
          set.add(id)
        }

        const isForeignSpam = await postService.checkIsSpam(title, body, username, '', 'US')
        if (isForeignSpam) {
          set.add(id)
          continue
        }

        const isInternalSpam = await postService.checkIsSpam(title, body, username, '', 'KR')
        if (isInternalSpam) {
          set.add(id)
        }
      }

      const isSpamCount = set.size
      console.log('isSpamCount: ', isSpamCount)
      console.log('ratio: ', isSpamCount / maxPostLength)

      const allowIds: number[] = []
      for (const id of allowIds) {
        set.add(id)
      }

      const notFilteredPosts = posts.filter((post) => !set.has(post.id))
      console.log('notFilteredPosts', notFilteredPosts[0])
    } catch (error) {
      throw error
    }
  }
}

type PostData = {
  id: number
  title: string
  body: string
  tags: string
  username: string
}
