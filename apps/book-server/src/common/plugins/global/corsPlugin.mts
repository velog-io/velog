import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'
import cors from '@fastify/cors'
import { ForbiddenError } from '@errors/ForbiddenError.mjs'
import { ENV } from '@env'

export const getWhiteList = (): RegExp[] => {
  const whiteList: RegExp[] = [
    /^https:\/\/velog.io$/,
    /^https:\/\/(.*).velog.io$/,
    /^https:\/\/(.*\.velog\.io)$/,
    /https:\/\/(.*)--velog.netlify.com/,
    /https:\/\/velog.graphcdn.app/,
  ]

  if (ENV.appEnv === 'development') {
    whiteList.push(/^http:\/\/localhost/)
  }

  return whiteList
}

const corsPlugin: FastifyPluginAsync = async (fastify) => {
  const corsWhiteList = getWhiteList()

  await fastify.register(cors, {
    credentials: true,
    origin: (origin, callback) => {
      if (!origin || corsWhiteList.some((re) => re.test(origin))) {
        callback(null, true)
      } else {
        callback(new ForbiddenError('Not allow origin'), false)
      }
    },
  })
}

export default fp(corsPlugin)
