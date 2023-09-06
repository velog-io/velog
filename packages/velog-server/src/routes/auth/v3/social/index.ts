import { SocialController } from '@routes/auth/v3/social/SocialController.js'
import { SocialProvider } from '@services/SocialService/SocialServiceInterface'
import { FastifyPluginCallback, FastifyReply, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'

const socialRoute: FastifyPluginCallback = (fastify, opts, done) => {
  const controller = container.resolve(SocialController)

  /* LOGIN & REGISTER */
  fastify.post('/register', controller.socialRegister)

  fastify.decorateRequest('socialProfile', null)
  fastify.get<{ Querystring: SocialCallbackQuerystring }>(
    '/callback/google',
    {
      preHandler: (request) => controller.googleCallback(request),
    },
    (request, reply) => controller.socialCallback(request, reply),
  )
  fastify.get<{ Querystring: SocialCallbackQuerystring }>(
    '/callback/facebook',
    { preHandler: (request) => controller.facebookCallback(request) },
    (request, reply) => controller.socialCallback(request, reply),
  )
  fastify.get<{ Querystring: SocialCallbackQuerystring }>(
    '/callback/github',
    { preHandler: (request) => controller.githubCallback(request) },
    (request, reply) => controller.socialCallback(request, reply),
  )

  /* Login Token */
  fastify.get('/profile', controller.getSocialProfile)
  fastify.get(
    '/redirect/:provider',
    (
      request: FastifyRequest<{
        Params: { provider: SocialProvider }
        Querystring: { next: string; isIntegrate: string; integrateState: string }
      }>,
      reply: FastifyReply,
    ) => controller.socialRedirect(request, reply),
  )

  done()
}

export default socialRoute

type SocialCallbackQuerystring = {
  code: string
  state?: string
  next?: string
}
