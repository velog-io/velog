import { FastifyPluginAsync } from 'fastify'
import cors from '@fastify/cors'
import { ForbiddenError } from '@errors/ForbiddenError.js'
import { ENV } from '@env'

const corsPlugin: FastifyPluginAsync = async (fastify) => {
  const corsWhitelist: RegExp[] = [
    /^https:\/\/velog.io$/,
    /^https:\/\/(.*).velog.io$/,
    /^https:\/\/(.*)\.velog.io$/,
    /https:\/\/(.*)--velog.netlify.com/,
    /https:\/\/velog.graphcdn.app/,
    // stage
    /^https:\/\/stage.velog.io$/,
    /^https:\/\/stage-api.velog.io$/,
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
