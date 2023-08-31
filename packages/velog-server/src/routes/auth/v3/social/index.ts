import { SocialController } from '@routes/auth/v3/social/SocialController.js'
import { FastifyPluginCallback } from 'fastify'
import { container } from 'tsyringe'

const socialRoute: FastifyPluginCallback = (fastify, opts, done) => {
  const socialController = container.resolve(SocialController)

  /* LOGIN & REGISTER */
  // fastify.post('/register', socialRegister)

  fastify.decorateRequest('socialProfile', null)
  fastify.get<{ Querystring: SocialCallbackQuerystring }>(
    '/callback/google',
    { preHandler: socialController.googleCallback },
    socialController.socialCallback,
  )
  fastify.get<{ Querystring: SocialCallbackQuerystring }>(
    '/callback/facebook',
    { preHandler: socialController.facebookCallback },
    socialController.socialCallback,
  )
  fastify.get<{ Querystring: SocialCallbackQuerystring }>(
    '/callback/github',
    { preHandler: socialController.githubCallback },
    socialController.socialCallback,
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
