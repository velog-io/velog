import Fastify from 'fastify'
import formbody from '@fastify/formbody'
import cookie from '@fastify/cookie'
import { ENV } from '@env'
import routes from '@routes/index.js'
import multer from 'fastify-multer'
import validatorCompilerPlugin from '@plugins/global/validatorCompilerPlugin.js'
import corsPlugin from '@plugins/global/corsPlugin.js'
import authPlugin from '@plugins/global/authPlugin.js'
import ipaddrPlugin from '@plugins/global/ipaddrPlugin.js'
import mercuriusPlugin from '@plugins/global/mercuriusPlugin.js'
import errorHandlerPlugin from '@plugins/global/errorHandlerPlugin.js'
import keepAlivePlugin from '@plugins/global/keepAlivePlugin.js'

const app = Fastify({
  logger: true,
  trustProxy: true,
})

app.register(cookie, { secret: ENV.cookieSecretKey })
app.register(formbody)

await app.register(corsPlugin)
app.register(authPlugin)
app.register(ipaddrPlugin)
app.register(mercuriusPlugin)
app.register(errorHandlerPlugin)
app.register(keepAlivePlugin)
app.register(multer.contentParser)
app.register(validatorCompilerPlugin)

app.register(routes)

export default app
