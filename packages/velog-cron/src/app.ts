import Fastify from 'fastify'
import fastifyCron from 'fastify-cron'
import { PostScoreJob } from 'src/jobs/PostScoreJob.js'
import { container } from 'tsyringe'

const app = Fastify({
  logger: true,
})

const postScoreJob = container.resolve(PostScoreJob)

app.register(fastifyCron, {
  jobs: [
    {
      cronTime: '*/5 * * * *',
      onTick: async () => {
        if (postScoreJob.isJobProgressing) return
        postScoreJob.startPostScoreJob()
        await postScoreJob.scoreCalculation()
        postScoreJob.stopPostScoreJob()
      },
    },
  ],
})

export default app
