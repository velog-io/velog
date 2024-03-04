import { container } from 'tsyringe'
import { FastifyPluginAsync } from 'fastify'
import cors from '@fastify/cors'
import { ForbiddenError } from '@errors/ForbiddenError.mjs'
import { EnvService } from '@lib/env/EnvService.mjs'

const corsPlugin: FastifyPluginAsync = async (fastify) => {
  console.log('hello')
  const corsWhitelist: RegExp[] = [
    /^https:\/\/velog.io$/,
    /^https:\/\/(.*).velog.io$/,
    /^https:\/\/(.*\.velog\.io)$/,
    /https:\/\/(.*)--velog.netlify.com/,
    /https:\/\/velog.graphcdn.app/,
  ]

  const env = container.resolve(EnvService)
  if (env.get('appEnv') === 'development') {
    corsWhitelist.push(/^http:\/\/localhost/)
  }

  fastify.register(cors, {
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

export default corsPlugin
