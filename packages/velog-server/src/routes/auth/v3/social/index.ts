import googleCallback from '@routes/auth/v3/social/hooks/googleCallback.js'
import { FastifyPluginCallback } from 'fastify'

const socialRoute: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.decorateRequest('socialProfile', null)
  fastify.get<{ Querystring: { code: string } }>(
    '/callback/google',
    { preHandler: googleCallback },
    (request, reply) => {
      console.log(request.socialProfile)
      reply.send('hello')
    },
  )
  fastify.get<{ Querystring: { code: string } }>('/callback/facebook', (request, reply) => {})
  fastify.get<{ Querystring: { code: string } }>('/callback/github', (request, reply) => {})
  done()
}

export default socialRoute
