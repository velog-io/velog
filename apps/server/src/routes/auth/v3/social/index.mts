import { SocialController } from '@routes/auth/v3/social/SocialController.mjs'
import { SocialProvider } from '@services/SocialService/SocialServiceInterface.js'
import { FastifyPluginCallback, FastifyReply, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'

const socialRoute: FastifyPluginCallback = (fastify, opts, done) => {
  const controller = container.resolve(SocialController)

  /* LOGIN & REGISTER */
  fastify.post(
    '/register',
    async (
      request: FastifyRequest<{
        Body: { display_name: string; username: string; short_bio: string }
      }>,
      reply,
    ) => await controller.socialRegister(request, reply),
  )

  fastify.decorateRequest('socialProfile', null)
  fastify.get<{ Querystring: SocialCallbackQuerystring }>(
    '/callback/google',
    {
      preHandler: (request) => controller.googleCallback(request),
    },
    async (request, reply) => {
      const { state, next } = request.query
      return await controller.socialCallback({
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
    async (request, reply) => {
      const { state, next } = request.query
      return await controller.socialCallback({
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
    async (request, reply) => {
      const { state, next } = request.query
      return await controller.socialCallback({
        socialProfile: request.socialProfile,
        queryNext: next,
        queryState: state,
        reply,
      })
    },
  )

  /* Login Token */
  fastify.get('/profile', async (request) => await controller.getSocialProfile(request))
  fastify.get(
    '/redirect/:provider',
    async (
      request: FastifyRequest<{
        Params: { provider: SocialProvider }
        Querystring: { next: string; isIntegrate: string; integrateState: string }
      }>,
      reply: FastifyReply,
    ) => {
      const { next, isIntegrate, integrateState } = request.query
      const { provider } = request.params
      return await controller.socialRedirect({ next, isIntegrate, integrateState, provider, reply })
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
