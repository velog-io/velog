import Fastify from 'fastify'
import { ENV } from '@env'

const app = Fastify({
  logger: true
})

export default app
