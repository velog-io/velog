import autoload from '@fastify/autoload'
import Fastify from 'fastify'
import fastifyCron from 'fastify-cron'
import { container } from 'tsyringe'
import { UtilsService } from '@lib/utils/UtilsService.js'
import routes from '@routes/index.js'

const app = Fastify({
  logger: true,
})

app.register(fastifyCron)

const utils = container.resolve(UtilsService)
app.register(autoload, {
  dir: utils.resolveDir('./src/common/plugins/globals'),
  encapsulate: false,
  forceESM: true,
})

app.register(routes)

export default app
