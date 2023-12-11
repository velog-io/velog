import { FastifyPluginCallback } from 'fastify'
import { ENV } from '@env'
import cors from '@fastify/cors'
import { ForbiddenError } from '@errors/ForbiddenError.js'

const corsPlugin: FastifyPluginCallback = (fastify, opts, done) => {
  const corsWhitelist: RegExp[] = [
    /^https:\/\/velog.io$/,
    /^https:\/\/(.*).velog.io$/,
    /^https:\/\/(.*)\.velog.io$/,
  ]

  if (ENV.appEnv === 'development') {
    // corsWhitelist.push(/^http:\/\/localhost/)
  }

  fastify.register(cors, {
    credentials: true,
    methods: ['OPTIONS', 'GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    optionsSuccessStatus: 204,
    origin: (origin, callback) => {
      if (!origin || corsWhitelist.some((re) => re.test(origin))) {
        console.log('hello')
        callback(null, true)
      } else {
        console.log('forbiddenError')
        callback(new ForbiddenError(), false)
      }
    },
  })

  done()
}

export default corsPlugin
