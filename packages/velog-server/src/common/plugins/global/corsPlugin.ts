import { FastifyPluginAsync } from 'fastify'
import { ENV } from 'src/env.js'
import cors from '@fastify/cors'
import { ForbiddenError } from '@errors/forbiddenError.js'

const corsPlugin: FastifyPluginAsync = async (fastify) => {
  const corsWhitelist: RegExp[] = [
    /^https:\/\/velog.io$/,
    /^https:\/\/alpha.velog.io$/,
    /^https:\/\/prod.velog.io$/,
    /https:\/\/(.*)--velog.netlify.com/,
    /https:\/\/velog.graphcdn.app/,
  ]

  if (ENV.appEnv === 'development') {
    corsWhitelist.push(/^http:\/\/localhost/)
  }

  fastify.register(cors, {
    credentials: true,
    origin: (origin, callback) => {
      if (!origin || corsWhitelist.some((re) => re.test(origin))) {
        callback(null, true)
      } else {
        callback(new ForbiddenError(), false)
      }
    },
  })
}

export default corsPlugin
