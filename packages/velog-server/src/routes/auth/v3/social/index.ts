import { SocialService } from '@services/SocialService/index.js'
import { FastifyPluginCallback } from 'fastify'
import { container } from 'tsyringe'

const socialRoute: FastifyPluginCallback = (fastify, opts, done) => {
  const socialService = container.resolve(SocialService)
  fastify.get<{ Querystring: { code: string } }>('/callback/google', (request, reply) => {
    const code = request.query.code
    const profile = socialService.getSocialDataFromGithub(code)
    reply.send(profile)
  })
  fastify.get<{ Querystring: { code: string } }>('/callback/facebook', (request, reply) => {})
  fastify.get<{ Querystring: { code: string } }>('/callback/github', (request, reply) => {})
  done()
}

export default socialRoute
