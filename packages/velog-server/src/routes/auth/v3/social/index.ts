import { SocialController } from '@routes/auth/v3/social/SocialController.js'
import { SocialProvider } from '@services/SocialService/SocialServiceInterface'
import { FastifyPluginCallback, FastifyReply, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'

const socialRoute: FastifyPluginCallback = (fastify, opts, done) => {
  const controller = container.resolve(SocialController)

  /* LOGIN & REGISTER */
  fastify.post(
    '/register',
    (
      request: FastifyRequest<{
        Body: { display_name: string; username: string; short_bio: string }
      }>,
      reply: FastifyReply,
    ) => controller.socialRegister(request, reply),
  )

  fastify.decorateRequest('socialProfile', null)
  fastify.get<{ Querystring: SocialCallbackQuerystring }>(
    '/callback/google',
    {
      preHandler: (request) => controller.googleCallback(request),
    },
    (request, reply) => {
      const { state, next } = request.query
      return controller.socialCallback({
        socialProfile: request.socialProfile,
        queryNext: next,
        queryState: state,
        reply,
      })
    },
  )
  fastify.get<{ Querystring: SocialCallbackQuerystring }>(
    '/callback/facebook',
    { preHandler: (request) => controller.facebookCallback(request) },
    (request, reply) => {
      const { state, next } = request.query
      return controller.socialCallback({
        socialProfile: request.socialProfile,
        queryNext: next,
        queryState: state,
        reply,
      })
    },
  )
  fastify.get<{ Querystring: SocialCallbackQuerystring }>(
    '/callback/github',
    { preHandler: (request) => controller.githubCallback(request) },
    (request, reply) => {
      const { state, next } = request.query
      return controller.socialCallback({
        socialProfile: request.socialProfile,
        queryNext: next,
        queryState: state,
        reply,
      })
    },
  )

  /* Login Token */
  fastify.get('/profile', (_, reply: FastifyReply) => controller.getSocialProfile(reply))
  fastify.get(
    '/redirect/:provider',
    (
      request: FastifyRequest<{
        Params: { provider: SocialProvider }
        Querystring: { next: string; isIntegrate: string; integrateState: string }
      }>,
      reply: FastifyReply,
    ) => {
      const { next, isIntegrate, integrateState } = request.query
      const { provider } = request.params
      return controller.socialRedirect({ next, isIntegrate, integrateState, provider, reply })
    },
  )

  done()
}

export default socialRoute

type SocialCallbackQuerystring = {
  code: string
  state?: string
  next?: string
}
