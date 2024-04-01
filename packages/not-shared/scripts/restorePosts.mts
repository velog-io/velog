import 'reflect-metadata'
import { container, injectable, singleton } from 'tsyringe'
// import { data } from '../data/data.mjs'
import { Prisma } from '@packages/database/src/velog-rds/index.mjs'
import { DbService } from '../lib/db/DbService.mjs'

const ENV = {
  restorePostsUsername: process.env.RESTORE_POSTS_USERNAME,
}

@singleton()
@injectable()
class Runner {
  constructor(private readonly db: DbService) {}
  public async run(data: Data, username: string) {
    if (!data) {
      throw new Error('Not found posts data')
    }

    const user = await this.db.user.findUnique({
      where: {
        username,
      },
    })

    if (!user) {
      throw new Error('Not found User')
    }

    const dump: Prisma.PostCreateManyInput[] = data.hits.hits
      .map((hit) => hit._source)
      .map((source) => ({
        title: source.title,
        body: source.body,
        thumbnail: source.thumbnail,
        is_private: source.is_private,
        url_slug: source.url_slug,
        fk_user_id: user.id,
        meta: source.meta,
        created_at: source.released_at,
        is_markdown: true,
        is_temp: false,
      }))

    for (let i = 0; i < dump.length; i++) {
      const newPost = dump[i]

      const post = await this.db.post.findFirst({
        where: {
          title: newPost.title,
          url_slug: newPost.url_slug,
          fk_user_id: user.id,
        },
      })

      if (post) {
        console.log('exists post')
        continue
      }

      await this.db.post.create({
        data: {
          ...newPost,
        },
      })

      console.log(`created post count: ${i + 1} / ${dump.length}`)
    }
  }
}

;(async function () {
  const username = ENV.restorePostsUsername

  if (!username) {
    throw new Error('Missing post owner username')
  }

  const runner = container.resolve(Runner)
  // await runner.run(data, username)
})()

type Data = DataResponse | null

type UserData = {
  id: string
  username: string
  profile: {
    id: string
    display_name: string
    thumbnail: null | string
  }
}

type PostSource = {
  id: string
  title: string
  body: string
  thumbnail: null | string
  user: UserData
  is_private: boolean
  released_at: string
  likes: number
  views: number
  meta: {
    short_description: string
  }
  tags: string[]
  url_slug: string
}

type PostHit = {
  _index: string
  _type: string
  _id: string
  _score: number
  _source: PostSource
}

type Hits = {
  total: {
    value: number
    relation: string
  }
  max_score: number
  hits: PostHit[]
}

type DataResponse = {
  took: number
  timed_out: boolean
  _shards: {
    total: number
    successful: number
    skipped: number
    failed: number
  }
  hits: Hits
}
