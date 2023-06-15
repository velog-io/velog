import { JwtService } from '@lib/jwt/jwtService.js'
import { AccessTokenData, RefreshTokenData } from '@lib/jwt/jwt.interface'
import { UserService } from '@services/userService/userService.js'
import { FastifyPluginAsync, FastifyReply } from 'fastify'
import { container } from 'tsyringe'
import { CookieService } from '@lib/cookie/cookieService.js'

const refresh = async (reply: FastifyReply, refreshToken: string) => {
  try {
    const jwtService = container.resolve(JwtService)
    const decoded = await jwtService.decodeToken<RefreshTokenData>(refreshToken)
    const userService = container.resolve(UserService)
    const user = await userService.findById(decoded.userId)

    if (!user) {
      const error = new Error('InvalidUserError')
      throw error
    }

    const tokens = await jwtService.refreshUserToken(
      user.id,
      decoded.tokenId,
      decoded.exp,
      refreshToken
    )

    const cookieService = container.resolve(CookieService)
    cookieService.setCookie(reply, 'access_token', tokens.accessToken, {
      maxAge: 1000 * 60 * 60,
    })
    return decoded.userId
  } catch (e) {
    throw e
  }
}

const authPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.decorateRequest('user', null)
  fastify.addHook('preHandler', async (request, reply) => {
    if (request.url.includes('/auth/logout')) return

    let accessToken: string | undefined = request.cookies['access_token']
    const refreshToken: string | undefined = request.cookies['refresh_token']

    const { authorization } = request.headers

    if (!accessToken && authorization) {
      accessToken = authorization.split(' ')[1]
    }

    const jwt = container.resolve(JwtService)
    try {
      if (!accessToken) {
        throw new Error('NoAccessToken')
      }
      const accessTokenData = await jwt.decodeToken<AccessTokenData>(
        accessToken
      )

      request.user!.id = accessTokenData.userId
      // refresh token when life < 30mins
      const diff = accessTokenData.exp * 1000 - new Date().getTime()
      if (diff < 1000 * 60 * 30 && refreshToken) {
        await refresh(reply, refreshToken)
      }
    } catch (e) {
      // invalid token! try token refresh...
      if (!refreshToken) return
      try {
        const userId = await refresh(reply, refreshToken)
        // set user_id if succeeds
        request.user.id = userId
      } catch (e) {}
    }
  })
}

export default authPlugin
