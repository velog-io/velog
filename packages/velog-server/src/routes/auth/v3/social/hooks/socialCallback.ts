import { ONE_DAY_IN_MS, ONE_HOUR_IN_MS } from '@constants/imeConstants.js'
import { ENV } from '@env'
import { CookieService } from '@lib/cookie/CookieService.js'
import { DbService } from '@lib/db/DbService.js'
import { JwtService } from '@lib/jwt/JwtService.js'
import { FastifyReply, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'

export default async function socialCallback(
  request: FastifyRequest<{ Querystring: { state: string; next?: string } }>,
  reply: FastifyReply
) {
  if (!request.socialProfile) {
    reply.status(404).send('Social profile data is missing')
    return
  }

  const { profile, socialAccount, accessToken, provider } = request.socialProfile

  if (!profile || !accessToken) return

  const db = container.resolve(DbService)
  const jwtService = container.resolve(JwtService)
  const cookie = container.resolve(CookieService)

  if (socialAccount) {
    const user = await db.user.findUnique({
      where: {
        id: socialAccount.fk_user_id!,
      },
    })

    if (!user) {
      throw new Error('User is missing')
    }

    const tokens = await jwtService.generateUserToken(user.id)
    cookie.setCookie(reply, 'access_token', tokens.accessToken, {
      maxAge: ONE_HOUR_IN_MS,
    })
    cookie.setCookie(reply, 'refresh_token', tokens.refreshToken, {
      maxAge: ONE_DAY_IN_MS * 30,
    })

    const redirectUrl = ENV.clientHost
    const state = request.query.state
      ? (JSON.parse(request.query.state) as { next: string; integrateState?: string })
      : null
    const next = request.query.next || state?.next || '/'

    // if (next.includes('user-integrate') && state) {
    //   const isIntegrated = await externalInterationService.checkIntegrated(user.id)
    //   if (isIntegrated) {
    //     const code = await externalInterationService.createIntegrationCode(user.id)
    //     ctx.redirect(`${process.env.CODENARY_CALLBACK}?code=${code}&state=${state.integrateState}`)
    //     return
    //   }
    // }

    reply.redirect(encodeURI(redirectUrl.concat(next)))
  }
}
