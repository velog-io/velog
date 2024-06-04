import type { FastifyPluginCallback } from 'fastify'
import { format } from 'date-fns'

const api: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.get('/ping', (request, reply) => {
    const now = new Date()
    const serverTime = format(now, 'yyyy-MM-dd HH:mm:ss')
    reply.send({ serverTime })
  })

  fastify.get('/check', (_, reply) => {
    reply.status(200).send({ version: 'books-api' })
  })

  done()
}

const routes: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.get('/', async (request) => {
    const ip = request.ipaddr
    const writer = request.writer
    return { writer, ip }
  })

  fastify.register(api, {
    prefix: '/api',
  })

  done()
}

export default routes
