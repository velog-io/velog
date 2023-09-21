import { format } from 'date-fns'
import { FastifyPluginCallback } from 'fastify'
import post from '@routes/posts/index.js'
import { HttpStatusMessage } from '@constants/HttpStatusMessageConstants.js'
import { container } from 'tsyringe'
import { RedisService } from '@lib/redis/RedisService.js'
import { HttpStatus } from '@constants/HttpStatusConstants.js'
import { FeedJob } from '@jobs/FeedJob.js'

const api: FastifyPluginCallback = (fastify, opts, done) => {
  const redis = container.resolve(RedisService)
  const feedJob = container.resolve(FeedJob)

  fastify.register(post, { prefix: '/posts' })

  fastify.get('/ping', async (_, reply) => {
    const serverCurrentTime = format(new Date(), 'yyyy-MM-dd:HH:mm:ss')
    reply.status(200).send({ serverCurrentTime })
  })

  fastify.post('/feed', (_, reply) => {
    for (let i = 0; i < 1; i++) {
      if (i % 1000 === 0) {
        console.log(`${i} / 10000`)
      }
      const queueName = redis.getQueueName('feed')
      const queueInfo = {
        writer_id: 'f99fb611-73a9-423d-bd66-16b41231a552',
        post_id: '7f02e7f2-747c-425d-96f8-2fbd66dc7cf4',
      }
      redis.lpush(queueName, JSON.stringify(queueInfo))
    }
    reply.status(HttpStatus.OK).send(HttpStatusMessage.Ok)
  })

  fastify.get('/feed', async (_, reply) => {
    await feedJob.createFeedJob()
    reply.status(HttpStatus.OK).send(HttpStatusMessage.Ok)
  })

  done()
}

const routes: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.get('/', (_, reply) => {
    reply.status(200).send(HttpStatusMessage.Ok)
  })

  fastify.register(api, {
    prefix: '/api',
  })

  done()
}

export default routes
