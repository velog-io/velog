import Fastify from 'fastify'
import fastifyCron from 'fastify-cron'
import routes from '@routes/index.js'
import closePlugin from '@plugins/encapsulated/closePlugin.js'
import checkApiKeyPlugin from '@plugins/global/checkApiKeyPlugin.mjs'
import corsPlugin from '@plugins/global/corsPlugin.mjs'
import cronPlugin from '@plugins/global/cronPlugin.mjs'
import errorHandlerPlugin from '@plugins/global/errorHandlerPlugin.mjs'

const app = Fastify({
  logger: true,
})

app.register(checkApiKeyPlugin)
app.register(corsPlugin)
app.register(errorHandlerPlugin)
app.register(closePlugin)
app.register(fastifyCron.default)

app.register(cronPlugin)

app.register(routes)

export default app
