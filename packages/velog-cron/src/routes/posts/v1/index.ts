import { FastifyPluginCallback } from 'fastify'
import { container } from 'tsyringe'
import { PutPostScoreOptions, PutPostScoreSchema } from '@routes/posts/v1/schema.js'
import PostService from '@services/PostService.js'
import { NotFoundError } from '@errors/NotfoundError.js'
import { HttpStatus } from '@constants/HttpStatusConstants.js'
import { HttpStatusMessage } from '@constants/HttpStatusMessageConstants.js'
import { ENV } from '@env'
import { BadRequestError } from '@errors/BadRequestErrors.js'
import { DbService } from '@lib/db/DbService.js'
import { utcToZonedTime } from 'date-fns-tz'
import { startOfDay, subMonths } from 'date-fns'

const v1: FastifyPluginCallback = (fastify, opts, done) => {
  const db = container.resolve(DbService)
  const postService = container.resolve(PostService)

  fastify.patch<PutPostScoreOptions>(
    '/score/:postId',
    {
      schema: PutPostScoreSchema,
    },
    async (request, reply) => {
      const { postId } = request.params

      const post = await postService.findById(postId)

      if (!post) {
        throw new NotFoundError('Not found Post')
      }

      await postService.scoreCarculator(post.id)

      reply.status(HttpStatus.OK).send(HttpStatusMessage.Ok)
    }
  )

  fastify.patch('/score', async (request, reply) => {
    if (ENV.appEnv !== 'development') {
      throw new BadRequestError('This operation is only allowed in development environment.')
    }

    const utcTime = new Date()
    const timezone = 'Asia/Seoul'
    const tz = utcToZonedTime(utcTime, timezone)
    const startOfToday = startOfDay(tz)
    const threeMonthsAgo = subMonths(startOfToday, 3)

    const posts = await db.post.findMany({
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

    const queue: string[][] = []
    let tick: string[] = []
    const tickSize = 200

    for (const post of posts) {
      tick.push(post.id)
      if (tick.length === tickSize) {
        queue.push(tick)
        tick = []
      }
    }

    if (tick.length > 0) {
      queue.push(tick)
    }

    for (let i = 0; i < queue.length; i++) {
      const postIds = queue[i]
      for (const postId of postIds) {
        await postService.scoreCarculator(postId)
      }
    }

    reply.status(HttpStatus.OK).send({ processedPostsCount: posts.length })
  })

  done()
}

export default v1
