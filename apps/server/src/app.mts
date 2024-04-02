import autoload from '@fastify/autoload'
import Fastify from 'fastify'
import formbody from '@fastify/formbody'
import cookie from '@fastify/cookie'
import { ENV } from 'src/env.mjs'
import { UtilsService } from '@lib/utils/UtilsService.js'
import { container } from 'tsyringe'
import routes from '@routes/index.js'
import multer from 'fastify-multer'
import validatorCompilerPlugin from '@plugins/global/validatorCompilerPlugin.mjs'

const app = Fastify({
  logger: true,
  trustProxy: true,
})

app.register(cookie, { secret: ENV.cookieSecretKey })
app.register(formbody)

const utils = container.resolve(UtilsService)
app.register(autoload, {
  dir: utils.resolveDir('./src/common/plugins/global'),
  encapsulate: false,
  forceESM: true,
})

app.register(multer.contentParser)
app.register(validatorCompilerPlugin)

app.register(routes)

export default app
