import { PostScoreJob } from '@jobs/PostScoreJob.js'
import { FastifyPluginCallback } from 'fastify'
import { container } from 'tsyringe'

const createJobPlugin: FastifyPluginCallback = (fastfiy, opts, done) => {
  const postScoreJob = container.resolve(PostScoreJob)

  const postScoreCalculateJob = fastfiy.cron.createJob({
    name: 'posts score calculation',
    cronTime: '*/5 * * * *', // every 5 minutes
    onTick: async () => {
      if (postScoreJob.isJobProgressing) return
      postScoreJob.startPostScoreJob()
      await postScoreJob.scoreCalculation()
      postScoreJob.stopPostScoreJob()
    },
  })

  postScoreCalculateJob.start()
  done()
}

export default createJobPlugin
