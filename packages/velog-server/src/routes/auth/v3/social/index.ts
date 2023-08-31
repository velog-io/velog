import { SocialController } from '@routes/auth/v3/social/SocialController.js'
import { FastifyPluginCallback } from 'fastify'
import { container } from 'tsyringe'

const socialRoute: FastifyPluginCallback = (fastify, opts, done) => {
  const controller = container.resolve(SocialController)

  /* LOGIN & REGISTER */
  fastify.post('/register', controller.socialRegister)

  fastify.decorateRequest('socialProfile', null)
  fastify.get<{ Querystring: SocialCallbackQuerystring }>(
    '/callback/google',
    { preHandler: controller.googleCallback },
    controller.socialCallback,
  )
  fastify.get<{ Querystring: SocialCallbackQuerystring }>(
    '/callback/facebook',
    { preHandler: controller.facebookCallback },
    controller.socialCallback,
  )
  fastify.get<{ Querystring: SocialCallbackQuerystring }>(
    '/callback/github',
    { preHandler: controller.githubCallback },
    controller.socialCallback,
  )

  /* Login Token */
  // social.get('/profile', getSocialProfile)
  // social.get('/redirect/:provider', socialRedirect)

  done()
}

export default socialRoute

type SocialCallbackQuerystring = {
  code: string
  state?: string
  next?: string
}
