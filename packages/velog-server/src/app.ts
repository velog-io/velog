import autoload from '@fastify/autoload'
import Fastify from 'fastify'
import formbody from '@fastify/formbody'
import cookie from '@fastify/cookie'
import { ENV } from '@env'
import { UtilsService } from '@lib/utils/UtilsService.js'
import { container } from 'tsyringe'

const app = Fastify({
  logger: true,
})

app.register(cookie, { secret: ENV.cookieSecretKey })
app.register(formbody)

const utils = container.resolve(UtilsService)
app.register(autoload, {
  dir: utils.resolveDir('./src/common/plugins/global'),
  encapsulate: false,
  forceESM: true,
})

app.register(autoload, {
  dir: utils.resolveDir('./src/routes'),
  options: Object.assign({ prefix: '/api' }),
  forceESM: true,
})

export default app
