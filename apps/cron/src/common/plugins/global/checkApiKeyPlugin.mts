import { ENV } from '@env'
import { UnauthorizedError } from '@errors/UnauthorizedError.mjs'
import { FastifyPluginCallback } from 'fastify'
import fp from 'fastify-plugin'

const checkApiKeyPlugin: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.addHook('preHandler', (request, reply, done) => {
    if (request.url === '/') {
      done()
    }

    const cronApiKey = request.headers['cron-api-key']
    if (!cronApiKey || ENV.cronApiKey !== cronApiKey) {
      throw new UnauthorizedError('Invalid api key')
    }
    done()
  })
  done()
}

export default fp(checkApiKeyPlugin)
