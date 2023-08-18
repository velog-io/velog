import autoload from '@fastify/autoload'
import Fastify from 'fastify'
import fastifyCron from 'fastify-cron'
import { container } from 'tsyringe'
import { PostScoreJob } from 'src/jobs/PostScoreJob.js'
import { UtilsService } from '@lib/utils/UtilsService.js'
import routes from '@routes/index.js'

const app = Fastify({
  logger: true,
})

const utils = container.resolve(UtilsService)
app.register(autoload, {
  dir: utils.resolveDir('./src/common/plugins'),
  encapsulate: false,
  forceESM: true,
})

app.register(routes, { prefix: '/api' })

const postScoreJob = container.resolve(PostScoreJob)

app.register(fastifyCron, {
  jobs: [
    {
      cronTime: '*/5 * * * *', // every 5 minutes
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
