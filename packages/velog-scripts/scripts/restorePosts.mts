import 'reflect-metadata'
import { container, injectable, singleton } from 'tsyringe'
import { data } from '../data/data.mjs'
import { Prisma } from '@prisma/client'
import { DbService } from '../lib/db/DbService.mjs'
import { ENV } from '../env/env.mjs'

@singleton()
@injectable()
class Runner {
  constructor(private readonly db: DbService) {}
  public async run(data: Data, username: string) {
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
  await runner.run(data, username)
})()

type Data = typeof data
