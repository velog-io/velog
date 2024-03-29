import Fastify from 'fastify'
import corsPlugin from '@plugins/global/corsPlugin.mjs'
import ipaddrPlugin from '@plugins/global/ipaddrPlugin.mjs'
import mercuriusPlugin from '@plugins/global/mercuriusPlugin.mjs'

const app = Fastify({
  logger: true,
  trustProxy: true,
})

app.register(corsPlugin)
app.register(ipaddrPlugin)
app.register(mercuriusPlugin)

// app.register(autoload, {
//   dir: utils.resolveDir('./src/common/plugins/global'),
//   encapsulate: false,
//   forceESM: true,
// })

export default app
