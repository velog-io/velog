import Fastify from 'fastify'
import { ENV } from 'src/env.js'

const app = Fastify({
  logger: true,
})

export default app
