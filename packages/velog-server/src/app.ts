import autoload from '@fastify/autoload'
import Fastify from 'fastify'
import formbody from '@fastify/formbody'
import cookie from '@fastify/cookie'
import { ENV } from 'src/env.js'
import { UtilService } from '@lib/utils/utilService.js'
import { container } from 'tsyringe'

const app = Fastify({
  logger: true,
})

app.register(cookie, { secret: ENV.cookieSecretKey })
app.register(formbody)

const utils = container.resolve(UtilService)
app.register(autoload, {
  dir: utils.resolveDir('src/common/plugins/global/'),
  encapsulate: false,
  forceESM: true,
})

export default app
