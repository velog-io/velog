import autoload from '@fastify/autoload'
import { UtilsService } from '@lib/utils/UtilsService'
import Fastify from 'fastify'
import fastifyCron from 'fastify-cron'
import { PostScoreJob } from 'src/jobs/PostScoreJob.js'
import { container } from 'tsyringe'

const app = Fastify({
  logger: true,
})

const utils = container.resolve(UtilsService)
app.register(autoload, {
  dir: utils.resolveDir('./src/common/plugins'),
  encapsulate: false,
  forceESM: true,
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
