import { FastifyPluginAsync } from 'fastify'
import cors from '@fastify/cors'
import { ForbiddenError } from '@errors/ForbiddenError.js'
import { ENV } from 'src/env.mjs'
import fp from 'fastify-plugin'

// TODO: apply fastify-plugin
const corsPlugin: FastifyPluginAsync = async (fastify) => {
  const corsWhitelist: RegExp[] = [
    /^https:\/\/velog.io$/,
    /^https:\/\/(.*).velog.io$/,
    /^https:\/\/(.*\.velog\.io)$/,
    /https:\/\/(.*)--velog.netlify.com/,
    /https:\/\/velog.graphcdn.app/,
  ]

  if (ENV.appEnv === 'development') {
    corsWhitelist.push(/^http:\/\/localhost/)
  }

  await fastify.register(cors, {
    credentials: true,
    origin: (origin, callback) => {
      if (!origin || corsWhitelist.some((re) => re.test(origin))) {
        callback(null, true)
      } else {
        callback(new ForbiddenError('Not allow origin'), false)
      }
    },
  })
}

export default fp(corsPlugin)
