import { AuthController } from '@routes/auth/v3/AuthController'
import socialRoute from '@routes/auth/v3/social/index.js'
import { FastifyPluginCallback, FastifyReply, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'

const v3: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.register(socialRoute, { prefix: '/social' })

  const authController = container.resolve(AuthController)
  fastify.post('/sendmail', authController.sendMail)
  done()
}

export default v3
