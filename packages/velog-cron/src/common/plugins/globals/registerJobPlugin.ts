import { FeedJob } from '@jobs/FeedJob'
import { PostJob } from '@jobs/PostJob.js'
import { FastifyPluginCallback } from 'fastify'
import { container } from 'tsyringe'

const registerJobPlugin: FastifyPluginCallback = (fastfiy, opts, done) => {
  const postScoreCalculateJob = fastfiy.cron.createJob({
    name: 'posts score calculation',
    cronTime: '*/5 * * * *', // every 5 minutes
    onTick: async () => {
      const postJob = container.resolve(PostJob)
      if (postJob.isJobProgressing) return
      postJob.start()
      await postJob.scoreCalculation()
      postJob.stop()
    },
  })
  postScoreCalculateJob.start()

  const createFeedJob = fastfiy.cron.createJob({
    name: 'create feed by new post',
    cronTime: '*/20 * * * *', // every 20 minutes
    onTick: async () => {
      const feedJob = container.resolve(FeedJob)
      if (feedJob.isJobProgressing) return
      feedJob.start()
      await feedJob.handleFeed()
      feedJob.stop()
    },
  })
  createFeedJob.start()

  done()
}

export default registerJobPlugin
