import { PostJob } from '@jobs/PostJob.js'
import { FastifyPluginCallback } from 'fastify'
import { container } from 'tsyringe'

const registerCronPlugin: FastifyPluginCallback = (fastfiy, opts, done) => {
  const postJob = container.resolve(PostJob)

  const scoreCalculateJobInFiveMin = fastfiy.cron.createJob({
    name: 'posts score calculation in every 5 minutes',
    cronTime: '*/5 * * * *', // every 5 minutes
    onTick: async () => {
      if (postJob.isJobProgressing) return
      postJob.start()
      await postJob.run(0.5)
      postJob.stop()
    },
  })

  const scoreCalculateJobInDay = fastfiy.cron.createJob({
    name: 'posts score calculation in every day',
    cronTime: '0 6 * * *', // every day at 06:00 (6:00 AM)
    onTick: async () => {
      if (postJob.isJobProgressing) return
      postJob.start()
      await postJob.run(0.1)
      postJob.stop()
    },
  })

  scoreCalculateJobInFiveMin.start()
  scoreCalculateJobInDay.start()
  done()
}

export default registerCronPlugin
