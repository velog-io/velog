import cookie from '@fastify/cookie'
import Fastify from 'fastify'
import corsPlugin from '@plugins/global/corsPlugin.mjs'
import ipaddrPlugin from '@plugins/global/ipaddrPlugin.mjs'
import mercuriusPlugin from '@plugins/global/mercuriusPlugin.mjs'
import authPlugin from '@plugins/global/authPlugin.mjs'
import errorHandlerPlugin from '@plugins/global/errorHandlerPlugin.mjs'
import routes from '@routes/index.mjs'

import { ENV } from '@env'

const app = Fastify({
  logger: true,
  trustProxy: true,
})

app.register(cookie, { secret: ENV.cookieSecretKey })
app.register(corsPlugin)
app.register(ipaddrPlugin)
app.register(authPlugin)
app.register(mercuriusPlugin)
app.register(errorHandlerPlugin)

app.register(routes)

export default app
