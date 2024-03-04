import { container } from 'tsyringe'
import autoload from '@fastify/autoload'
import { UtilsService } from '@lib/utils/UtilsService.mjs'
import Fastify from 'fastify'

const app = Fastify({
  logger: true,
  trustProxy: true,
})

const utils = container.resolve(UtilsService)
app.register(autoload, {
  dir: utils.resolveDir('./src/common/plugins/global'),
  encapsulate: false,
  forceESM: true,
})

export default app
