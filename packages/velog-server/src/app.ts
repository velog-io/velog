import autoload from '@fastify/autoload'
import Fastify from 'fastify'
import formbody from '@fastify/formbody'
import cookie from '@fastify/cookie'
import { ENV } from '@env'
import { UtilsService } from '@lib/utils/UtilsService.js'
import { container } from 'tsyringe'
import routes from '@routes/index.js'
import Ajv from 'ajv'

const schemaCompilers = {
  body: new Ajv({
    removeAdditional: false,
    coerceTypes: false,
    allErrors: true,
  }),
  params: new Ajv({
    removeAdditional: false,
    coerceTypes: true,
    allErrors: true,
  }),
  querystring: new Ajv({
    removeAdditional: false,
    coerceTypes: true,
    allErrors: true,
  }),
  headers: new Ajv({
    removeAdditional: false,
    coerceTypes: true,
    allErrors: true,
  }),
}

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

app.register(routes)

app.setValidatorCompiler((request) => {
  if (!request.httpPart) {
    throw new Error('Missing httpPart')
  }
  const compiler = (schemaCompilers as Record<string, any>)[request.httpPart]
  if (!compiler) {
    throw new Error(`Missing compiler for ${request.httpPart}`)
  }
  return compiler.compile(request.schema)
})

export default app
