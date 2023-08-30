import { SocialService } from '@services/SocialService/index.js'
import { FastifyReply, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'

export default async function googleCallback(
  request: FastifyRequest<{ Querystring: { code: string } }>,
  reply: FastifyReply,
) {
  const socialService = container.resolve(SocialService)

  const { code } = request.query

  if (!code) {
    reply.status(400).send('Code is required')
    return
  }
  const profile = await socialService.getSocialDataFromGoogle(code)
  request.socialProfile = profile
}
