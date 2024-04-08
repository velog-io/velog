import Fastify from 'fastify'
import formbody from '@fastify/formbody'
import cookie from '@fastify/cookie'
import { ENV } from 'src/env.mjs'
import routes from '@routes/index.js'
import multer from 'fastify-multer'
import validatorCompilerPlugin from '@plugins/global/validatorCompilerPlugin.mjs'
import authPlugin from '@plugins/global/authPlugin.mjs'
import corsPlugin from '@plugins/global/corsPlugin.mjs'
import errorHandlerPlugin from '@plugins/global/errorHandlerPlugin.mjs'
import ipaddrPlugin from '@plugins/global/ipaddrPlugin.mjs'
import keepAlivePlugin from '@plugins/global/keepAlivePlugin.mjs'
import mercuriusPlugin from '@plugins/global/mercuriusPlugin.mjs'
import cors from '@fastify/cors'

const app = Fastify({
  logger: true,
  trustProxy: true,
})

app.register(cookie, { secret: ENV.cookieSecretKey })
app.register(formbody)

// await app.register(cors, {
//   credentials: true,
//   origin: (origin, callback) => {
//     callback(null, true)
//     // if (!origin || corsWhitelist.some((re) => re.test(origin))) {
//     //   callback(null, true)
//     // } else {
//     //   callback(new ForbiddenError('Not allow origin'), false)
//     // }
//   },
// })

await app.register(corsPlugin)
app.register(authPlugin)
app.register(ipaddrPlugin)
app.register(mercuriusPlugin)
app.register(multer.contentParser)
app.register(validatorCompilerPlugin)
app.register(errorHandlerPlugin)
app.register(keepAlivePlugin)

app.register(routes)

export default app
