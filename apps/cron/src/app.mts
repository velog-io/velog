import autoload from '@fastify/autoload'
import Fastify from 'fastify'
import fastifyCron from 'fastify-cron'
import { container } from 'tsyringe'
import { UtilsService } from '@lib/utils/UtilsService.js'
import routes from '@routes/index.js'
import closePlugin from '@plugins/encapsulated/closePlugin.js'

const app = Fastify({
  logger: true,
})

app.register(closePlugin)
app.register(fastifyCron.default)

const utils = container.resolve(UtilsService)
app.register(autoload, {
  dir: utils.resolveDir('./src/common/plugins/globals'),
  encapsulate: true,
  forceESM: true,
})

app.register(routes)

export default app
