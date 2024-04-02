import Fastify from 'fastify'
import corsPlugin from '@plugins/global/corsPlugin.mjs'
import ipaddrPlugin from '@plugins/global/ipaddrPlugin.mjs'
import mercuriusPlugin from '@plugins/global/mercuriusPlugin.mjs'
import autoload from '@fastify/autoload'
import { container } from 'tsyringe'
import { UtilsService } from '@lib/utils/UtilsService.mjs'

const app = Fastify({
  logger: true,
  trustProxy: true,
})

app.register(corsPlugin)
app.register(ipaddrPlugin)
app.register(mercuriusPlugin)

const utils = container.resolve(UtilsService)
app.register(autoload, {
  dir: utils.resolveDir('./src/common/plugins/global'),
  encapsulate: false,
  forceESM: true,
})

export default app
