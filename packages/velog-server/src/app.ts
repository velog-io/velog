import autoload from '@fastify/autoload'
import Fastify from 'fastify'
import formbody from '@fastify/formbody'
import cookie from '@fastify/cookie'
import { ENV } from 'src/env.js'
import { UtilsService } from '@lib/utils/UtilsService.js'
import { container } from 'tsyringe'

const app = Fastify({
  logger: true,
})

app.register(cookie, { secret: ENV.cookieSecretKey })
app.register(formbody)

const utils = container.resolve(UtilsService)
app.register(autoload, {
  dir: utils.resolveDir('src/common/plugins/global'),
  encapsulate: false,
  forceESM: true,
})

app.register(autoload, {
  dir: utils.resolveDir('src/routes'),
  options: Object.assign({ prefix: '/api' }),
  forceESM: true,
})

app.setErrorHandler((error, request, reply) => {
  if (error?.statusCode) {
    reply.status(error.statusCode)
  } else {
    reply.status(500)
  }
  reply.send({
    message: error.message || 'Unknown Error',
    name: error.name || 'Error',
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
  })
  if (process.env.NODE_ENV === 'development') {
    console.log(error)
  }
})

export default app
