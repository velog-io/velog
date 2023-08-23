import { FastifyPluginAsync } from 'fastify'
import { ENV } from '@env'
import cors from '@fastify/cors'
import { ForbiddenError } from '@errors/ForbiddenError.js'

const corsPlugin: FastifyPluginAsync = async (fastify) => {
  const corsWhitelist: RegExp[] = [
    /^https:\/\/velog.io$/,
    /^https:\/\/alpha.velog.io$/,
    /^https:\/\/prod.velog.io$/,
    /https:\/\/(.*)--velog.netlify.com/,
    /https:\/\/velog.graphcdn.app/,
    /^https:\/\/velog.pro$/, // stage
  ]

  if (ENV.appEnv !== 'production') {
    corsWhitelist.push(/^http:\/\/localhost/)
    corsWhitelist.push(/^https:\/\/velog.pro$/)
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
