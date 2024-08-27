import Fastify from 'fastify'
import fastifyCron from 'fastify-cron'
import routes from '@routes/index.mjs'
import closePlugin from '@plugins/encapsulated/closePlugin.mjs'
import checkApiKeyPlugin from '@plugins/global/checkApiKeyPlugin.mjs'
import corsPlugin from '@plugins/global/corsPlugin.mjs'
import errorHandlerPlugin from '@plugins/global/errorHandlerPlugin.mjs'
import cronPlugin from '@plugins/global/cronPlugin.mjs'

const app = Fastify({
  logger: true,
  pluginTimeout: 60000,
})

app.register(checkApiKeyPlugin)
app.register(corsPlugin)
app.register(errorHandlerPlugin)
app.register(closePlugin)
await app.register(fastifyCron.default)

await app.register(cronPlugin)

app.register(routes)

export default app
