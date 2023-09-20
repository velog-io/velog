import { PostJob } from '@jobs/PostJob.js'
import { FastifyPluginCallback } from 'fastify'
import { container } from 'tsyringe'

const createJobPlugin: FastifyPluginCallback = (fastfiy, opts, done) => {
  const postJob = container.resolve(PostJob)

  const postScoreCalculateJob = fastfiy.cron.createJob({
    name: 'posts score calculation',
    cronTime: '*/5 * * * *', // every 5 minutes
    onTick: async () => {
      if (postJob.isJobProgressing) return
      postJob.start()
      await postJob.scoreCalculation()
      postJob.stop()
    },
  })

  postScoreCalculateJob.start()
  done()
}

export default createJobPlugin
